// 상위 12개 주식 메타데이터 (KOSPI & KOSDAQ)
export const MOCK_STOCKS = [
  {
    code: "005930",
    name: "삼성전자",
    market: "KOSPI",
    sector: "반도체 / IT",
    price: 74200,
    change: 1.64,
    marketCap: "442조원",
    tags: ["#HBM공급확대", "#파운드리턴어라운드", "#외인순매수", "#배당수익"],
    description: "글로벌 1위 메모리 반도체 기업으로 HBM 및 차세대 AI 반도체 밸류체인 진입 본격화 기대감 유효."
  },
  {
    code: "000660",
    name: "SK하이닉스",
    market: "KOSPI",
    sector: "반도체 / IT",
    price: 188500,
    change: 3.29,
    marketCap: "137조원",
    tags: ["#HBM3E독점공급", "#AI수혜1순위", "#사상최대실적", "#엔비디아파트너"],
    description: "HBM3E 시장의 독보적 지배력을 바탕으로 엔비디아 AI 가속기 탑재 모멘텀을 주도하는 글로벌 대장주."
  },
  {
    code: "005380",
    name: "현대차",
    market: "KOSPI",
    sector: "자동차 / 모빌리티",
    price: 245000,
    change: 0.82,
    marketCap: "51조원",
    tags: ["#인도법인IPO", "#하이브리드호실적", "#밸류업수혜", "#주주환원"],
    description: "역대급 배당수익률과 북미 하이브리드 판매 호조, 기업 밸류업 프로그램의 대표 수혜주."
  },
  {
    code: "035420",
    name: "NAVER",
    market: "KOSPI",
    sector: "인터넷 / 플랫폼",
    price: 178000,
    change: -0.56,
    marketCap: "28조원",
    tags: ["#하이퍼클로바X", "#숏폼치지직", "#광고단가회복", "#AI검색"],
    description: "국내 최대 검색 포털 및 B2B AI 솔루션 플랫폼. 생성형 AI 에이전트 커머스 전환 가속화 중."
  },
  {
    code: "247540",
    name: "에코프로비엠",
    market: "KOSPI",
    sector: "2차전지 / 소재",
    price: 162000,
    change: -2.11,
    marketCap: "15조원",
    tags: ["#양극재글로벌1위", "#캐즘바닥론", "#LFP진출", "#코스피이전"],
    description: "하이니켈 양극재 선도 기업으로 전방 전기차 수요 둔화 우려 속에서도 중장기 수주 파이프라인 견고."
  },
  {
    code: "035720",
    name: "카카오",
    market: "KOSPI",
    sector: "인터넷 / 플랫폼",
    price: 37400,
    change: -1.06,
    marketCap: "16조원",
    tags: ["#카나나AI", "#비핵심자산정리", "#톡비즈회복", "#바닥권반등"],
    description: "국민 메신저 카카오톡 기반의 강력한 트래픽과 새로운 온디바이스/오픈채팅 AI 에이전트 서비스 출시 기대."
  },
  {
    code: "068270",
    name: "셀트리온",
    market: "KOSPI",
    sector: "바이오 / 헬스케어",
    price: 194500,
    change: 1.57,
    marketCap: "42조원",
    tags: ["#짐펜트라미국승인", "#통합셀트리온", "#PBM처방확대", "#신약전환"],
    description: "피하주사제형 짐펜트라의 미국 대형 처방약급여관리업체(PBM) 등재 성공으로 가파른 북미 매출 성장 기대."
  },
  {
    code: "005490",
    name: "POSCO홀딩스",
    market: "KOSPI",
    sector: "철강 / 친환경소재",
    price: 365000,
    change: 0.27,
    marketCap: "30조원",
    tags: ["#리튬상업생산", "#친환경인프라", "#철강업황반등", "#원자재헷지"],
    description: "전통 철강 산업의 탄탄한 현금흐름과 아르헨티나 염수 리튬 등 미래 2차전지 풀밸류체인 보유 지주사."
  },
  {
    code: "033780",
    name: "KT&G",
    market: "KOSPI",
    sector: "경기방어 / 소비재",
    price: 112000,
    change: 0.45,
    marketCap: "13조원",
    tags: ["#고배당귀족", "#글로벌전자담배", "#방어주피난처", "#자사주소각"],
    description: "지정학 리스크 및 경기 불황 국면에서 높은 배당(5%+)과 지속적인 자사주 매입 소각을 자랑하는 최강 방패."
  },
  {
    code: "207940",
    name: "삼성바이오로직스",
    market: "KOSPI",
    sector: "바이오 / 헬스케어",
    price: 982000,
    change: 2.19,
    marketCap: "69조원",
    tags: ["#CDMO세계최대", "#5공장조기가동", "#미국생물보안법", "#압도적수주"],
    description: "세계 최대 규모의 바이오 의약품 위탁생산(CDMO) 캐파와 미국 생물보안법 통과에 따른 최대 반사이익주."
  },
  {
    code: "055550",
    name: "신한지주",
    market: "KOSPI",
    sector: "금융 / 은행",
    price: 54300,
    change: 1.12,
    marketCap: "27조원",
    tags: ["#분기배당", "#주주환원율40%", "#PBR저평가", "#안정적이자이익"],
    description: "지속적인 분기배당과 자사주 소각을 실천하는 대표 금융지주사로 포트폴리오의 든든한 캐시카우 역할."
  },
  {
    code: "012450",
    name: "한화에어로스페이스",
    market: "KOSPI",
    sector: "방산 / 항공우주",
    price: 328000,
    change: 4.13,
    marketCap: "16조원",
    tags: ["#K-방산수주잭팟", "#K9자주포", "#지정학리스크수혜", "#글로벌수출"],
    description: "폴란드, 루마니아 등 유럽 및 중동 지역의 K-방산 수주 러시와 누리호 등 우주 발사체 총괄 기업."
  }
];

// 3대 미션 데이터
export const MISSIONS = [
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

// 최상급 랭커 (Top 0.1% Challenger) 가상 파트너 데이터
export const BOT_PARTNERS = [
  {
    id: "bot_challenger_pro",
    name: "여의도_천상계_고수",
    avatar: "👑",
    tier: "CHALLENGER",
    tierName: "TOP 0.1% 챌린저",
    rankTitle: "실전투자대회 3관왕 랭커",
    returnRate: "+284.5%",
    winRate: "91.4%",
    persona: "누적수익률 284%를 달성한 전국 최상위 0.1% 챌린저 랭커",
    styleTag: "👑 천상계 퀀트 모멘텀",
    suggestStock: "005380", // 현대차
    suggestReason: "천상계 랭커의 눈으로 볼 때, 외국인 프로그램 매수세 4거래일 연속 유입 중이며 밸류업 지수 편입 모멘텀으로 하방 경직성이 완벽합니다. 제 누적 284% 승률을 걸고 추천합니다!",
    replies: {
      onFirstSelect: (stock) => `역시 안목이 남다르시네요! ${stock.name}은 현재 기관 순매수 1순위입니다. 바로 승인하고 제 필살 종목 하나 얹겠습니다 🤝`,
      onFinalAgree: "완벽한 포트폴리오입니다! 이 조합이면 AI 심판관 알파독도 무조건 90점 이상 극찬할 수밖에 없습니다. 바로 결과 확인하시죠 🚀"
    }
  },
  {
    id: "bot_grandmaster_hedge",
    name: "청담동_헤지펀드_마스터",
    avatar: "💎",
    tier: "CHALLENGER",
    tierName: "TOP 0.1% 챌린저",
    rankTitle: "글로벌 매크로 헤지 전문",
    returnRate: "+226.8%",
    winRate: "89.2%",
    persona: "변동성 장세에서도 절대 손실을 보지 않는 탑티어 자산배분가",
    styleTag: "💎 절대수익 헤지펀더",
    suggestStock: "033780", // KT&G
    suggestReason: "매크로 지표 상 지금은 방어주 편입이 필수입니다. 배당수익률 5.5%에 현금흐름 독보적이라 시장 충격에도 계좌를 단단히 지켜줄 든든한 방패입니다.",
    replies: {
      onFirstSelect: (stock) => `호오, ${stock.name} 선택 아주 훌륭합니다. 시장 변동성을 감안한 전략적 초이스네요. 바로 승인합니다 👍`,
      onFinalAgree: "야수성과 안전성이 완벽히 조화된 황금 포트폴리오입니다. 알파독 심판관에게 점수 받아보시죠!"
    }
  }
];

// 실시간 시세 API 연동 헬퍼
export async function updateRealTimeStockPrices() {
  try {
    const res = await fetch('/api/stocks');
    if (!res.ok) return MOCK_STOCKS;
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      json.data.forEach(item => {
        const found = MOCK_STOCKS.find(s => s.code === item.code);
        if (found) {
          if (item.price) found.price = item.price;
          if (item.change !== undefined) found.change = item.change;
          if (item.marketCap) found.marketCap = item.marketCap;
        }
      });
    }
  } catch (err) {
    console.warn("Could not fetch real-time stocks, using default mock prices:", err);
  }
  return MOCK_STOCKS;
}
