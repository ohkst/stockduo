import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

// 사내 프록시 및 외부 SSL 요청 허용
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 10000;

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'dist')));

// 12개 핵심 종목 목록
const STOCK_CODES = [
  "005930", // 삼성전자
  "000660", // SK하이닉스
  "005380", // 현대차
  "035420", // NAVER
  "247540", // 에코프로비엠
  "035720", // 카카오
  "068270", // 셀트리온
  "005490", // POSCO홀딩스
  "033780", // KT&G
  "207940", // 삼성바이오로직스
  "055550", // 신한지주
  "012450"  // 한화에어로스페이스
];

// 실시간 시세 인메모리 캐시 (유효기간 30초)
let stockCache = null;
let lastCacheTime = 0;

// 네이버 증권 실시간 시세 단일 종목 조회
async function fetchNaverStock(code) {
  try {
    const res = await fetch(`https://m.stock.naver.com/api/stock/${code}/basic`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    
    // 가격 파싱
    const price = parseInt(String(data.closePrice || "0").replace(/,/g, ''), 10);
    
    // 등락률 파싱 (하락 여부 확인)
    let change = parseFloat(data.fluctuationsRatio || "0");
    const isFalling = data.compareToPreviousPrice?.name === 'FALLING' || String(data.fluctuationsRatio).startsWith('-');
    if (isFalling && change > 0) {
      change = -change;
    }

    return {
      code,
      name: data.stockName,
      price: price || 0,
      change: change || 0,
      marketCap: data.marketValue ? `${data.marketValue}억원` : undefined
    };
  } catch (err) {
    return null;
  }
}

// 실시간 시세 일괄 조회 API
app.get('/api/stocks', async (req, res) => {
  const now = Date.now();
  // 캐시가 유효하면 즉시 반환 (30초)
  if (stockCache && (now - lastCacheTime < 30000)) {
    return res.json({ success: true, data: stockCache, cached: true });
  }

  try {
    const results = await Promise.all(STOCK_CODES.map(code => fetchNaverStock(code)));
    const validStocks = results.filter(Boolean);
    if (validStocks.length > 0) {
      stockCache = validStocks;
      lastCacheTime = now;
      return res.json({ success: true, data: validStocks, cached: false });
    }
  } catch (err) {
    console.error("Failed to fetch real-time stock prices:", err);
  }

  // 실패 시 기존 캐시 또는 빈 배열 반환
  res.json({ success: !!stockCache, data: stockCache || [] });
});

// ==========================================
// 실시간 2인 매칭 시스템 (Socket.io)
// ==========================================
const waitingQueue = []; // [{ socketId, userProfile, socket }]
const activeRooms = new Map(); // roomId -> { id, players: [], basket: [null, null, null], mission }

const MISSIONS_LIST = [
  {
    id: "mission_blackswan",
    title: "🚨 2026 블랙스완 방어전",
    subtitle: "고유가 · 지정학 위기 돌파 포트폴리오",
    description: "글로벌 인플레이션 재점화 및 지정학 분쟁에 대비해 강력한 하방 경직성과 헷지 능력을 갖춘 3종목을 구성하세요.",
    targetSectors: ["방산 / 항공우주", "경기방어 / 소비재", "금융 / 은행"],
    difficulty: "도전",
    icon: "ShieldAlert"
  },
  {
    id: "mission_ai_valuechain",
    title: "🚀 차세대 AI 밸류체인 올인",
    subtitle: "초거대 모델 & 피지컬 AI 주도주 압축",
    description: "HBM 고대역폭 메모리부터 플랫폼, 로보틱스, 바이오 테크까지 미래 AI 혁신을 견인할 초강력 성장주를 발굴하세요.",
    targetSectors: ["반도체 / IT", "인터넷 / 플랫폼", "바이오 / 헬스케어"],
    difficulty: "보통",
    icon: "Cpu"
  },
  {
    id: "mission_cashcow",
    title: "💰 고배당 캐시카우 황금알",
    subtitle: "배당수익률 4%+ & 밸류업 프로그램 정조준",
    description: "고금리 장기화 시대에 안정적인 현금 흐름과 강력한 자사주 소각 정책으로 복리 수익을 안겨줄 종목을 엄선하세요.",
    targetSectors: ["자동차 / 모빌리티", "경기방어 / 소비재", "금융 / 은행"],
    difficulty: "쉬움",
    icon: "Coins"
  }
];

io.on('connection', (socket) => {
  // 1. 대기열 등록 (실제 유저 매칭 진입)
  socket.on('join_queue', (userProfile) => {
    // 기존에 대기열에 있다면 제거
    const existingIdx = waitingQueue.findIndex(item => item.socketId === socket.id);
    if (existingIdx !== -1) {
      waitingQueue.splice(existingIdx, 1);
    }

    // 대기열에 다른 사람이 있는 경우 즉시 매칭!
    if (waitingQueue.length > 0) {
      const partner = waitingQueue.shift();
      const roomId = `room_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      
      const mission = MISSIONS_LIST[Math.floor(Math.random() * MISSIONS_LIST.length)];

      const roomData = {
        id: roomId,
        players: [
          { socketId: partner.socketId, profile: partner.userProfile },
          { socketId: socket.id, profile: userProfile }
        ],
        basket: [null, null, null],
        mission
      };

      activeRooms.set(roomId, roomData);

      // 양쪽 소켓 방에 조인
      partner.socket.join(roomId);
      socket.join(roomId);

      // 상대방 정보와 함께 매칭 완료 통보
      partner.socket.emit('match_found', {
        roomId,
        partnerProfile: userProfile,
        mission,
        isHost: true
      });

      socket.emit('match_found', {
        roomId,
        partnerProfile: partner.userProfile,
        mission,
        isHost: false
      });

      console.log(`[MATCH SUCCESS] Room: ${roomId} | ${partner.userProfile.nickname} & ${userProfile.nickname}`);
    } else {
      // 대기열에 추가
      waitingQueue.push({
        socketId: socket.id,
        userProfile,
        socket
      });
      socket.emit('queue_joined', { waitSeconds: 600 });
      console.log(`[QUEUE] ${userProfile.nickname} joined queue. (Waiting: ${waitingQueue.length})`);
    }
  });

  // 2. 대기열 취소
  socket.on('leave_queue', () => {
    const idx = waitingQueue.findIndex(item => item.socketId === socket.id);
    if (idx !== -1) {
      waitingQueue.splice(idx, 1);
      console.log(`[QUEUE] Socket ${socket.id} left queue.`);
    }
  });

  // 3. 종목 제안 (상대방에게 팝업 전달)
  socket.on('propose_stock', ({ roomId, slotIndex, stock, userProfile }) => {
    socket.to(roomId).emit('stock_proposed', {
      slotIndex,
      stock,
      proposer: userProfile
    });
  });

  // 4. 종목 승인 (양쪽 바스켓 슬롯 동기화)
  socket.on('accept_stock', ({ roomId, slotIndex, stock, userProfile }) => {
    const room = activeRooms.get(roomId);
    if (room) {
      room.basket[slotIndex] = stock;
    }
    io.in(roomId).emit('stock_accepted', {
      slotIndex,
      stock,
      approver: userProfile
    });
  });

  // 5. 종목 거절
  socket.on('reject_stock', ({ roomId, stock, userProfile }) => {
    socket.to(roomId).emit('stock_rejected', {
      stock,
      rejector: userProfile
    });
  });

  // 6. 실시간 채팅 & 이모지 브로드캐스트
  socket.on('send_chat', ({ roomId, message }) => {
    socket.to(roomId).emit('receive_chat', message);
  });

  // 7. AI 수석 심판관 호출 (양쪽 동시 결과 화면 전환)
  socket.on('trigger_ai_evaluation', ({ roomId, basket }) => {
    io.in(roomId).emit('evaluation_started', { basket });
  });

  // 8. 연결 종료 처리
  socket.on('disconnect', () => {
    // 대기열에서 제거
    const idx = waitingQueue.findIndex(item => item.socketId === socket.id);
    if (idx !== -1) {
      waitingQueue.splice(idx, 1);
    }

    // 속한 방이 있다면 상대방에게 연결 끊김 알림
    for (const [roomId, room] of activeRooms.entries()) {
      const isPlayer = room.players.some(p => p.socketId === socket.id);
      if (isPlayer) {
        socket.to(roomId).emit('partner_disconnected');
        activeRooms.delete(roomId);
        break;
      }
    }
  });
});

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 StockDuo Real-time Server running on port ${PORT}`);
});
