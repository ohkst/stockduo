import React, { useState, useEffect, useRef } from 'react';
import { MOCK_STOCKS } from '../data/stocks';
import RankEmblem from './RankEmblem';
import { 
  Clock, Search, Check, Send, Sparkles, AlertCircle, Bot, ThumbsUp, Flame, 
  Rocket, X, HelpCircle, ChevronRight, Award, Crown, Users
} from 'lucide-react';

const QUICK_EMOJIS = ["👍", "🚀", "🔥", "💎", "👏", "👀"];

export default function StepCollaboration({ 
  userProfile, 
  partner, 
  mission, 
  isRealMatch, 
  roomId, 
  socket, 
  onCompleteCollaboration 
}) {
  // 3개 슬롯 바스켓 상태
  const [basket, setBasket] = useState([null, null, null]);

  // 3분 타이머 (180초)
  const [timeLeft, setTimeLeft] = useState(180);

  // 검색 및 필터
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("전체");

  // 파트너 이름 및 아바타
  const partnerName = partner.nickname || partner.name;
  const partnerAvatar = partner.avatar || "👤";

  // 채팅 내역
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "system",
      text: `[${mission.title}] 미션 룸에 입장했습니다. ${isRealMatch ? '실제 파트너와' : '전국 1위 챌린저 랭커와'} 3분 안에 3종목을 합의하세요!`
    },
    {
      id: 2,
      sender: "partner",
      name: partnerName,
      avatar: partnerAvatar,
      text: isRealMatch
        ? `반갑습니다 ${userProfile.nickname}님! 함께 미션을 돌파할 3종목을 골라보시죠. 첫 번째 종목 먼저 제안해주세요!`
        : `반갑습니다 ${userProfile.nickname}님! ${partner.rankTitle}(수익률 ${partner.returnRate})입니다. 첫 번째 핵심 종목 먼저 골라주시면 제가 즉시 수급 분석해드리겠습니다!`
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatBottomRef = useRef(null);

  // 종목 제안 팝업 모달 상태
  const [proposalModal, setProposalModal] = useState(null);

  // 자동 스크롤
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 3분 카운트다운 타이머
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // ==========================================
  // 실제 2인 소켓 이벤트 리스너
  // ==========================================
  useEffect(() => {
    if (!isRealMatch || !socket) return;

    // 상대방의 종목 제안 수신
    const handleStockProposed = ({ slotIndex, stock, proposer }) => {
      setProposalModal({
        stock,
        slotIndex,
        proposer,
        reason: `${proposer.nickname}님이 [${stock.name}] 종목을 바스켓 슬롯 ${slotIndex + 1}번에 제안했습니다!`
      });
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: "partner",
          name: proposer.nickname,
          avatar: proposer.avatar,
          text: `[${stock.name}]을 슬롯 ${slotIndex + 1}번에 제안합니다. 확인 부탁드립니다!`
        }
      ]);
    };

    // 종목 승인 수신 (양쪽 바스켓 동기화)
    const handleStockAccepted = ({ slotIndex, stock, approver }) => {
      setBasket(prev => {
        const next = [...prev];
        next[slotIndex] = stock;
        return next;
      });
      setProposalModal(null);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: "system",
          text: `✅ [${stock.name}]이 슬롯 ${slotIndex + 1}번에 최종 확정되었습니다!`
        }
      ]);
    };

    // 종목 거절 수신
    const handleStockRejected = ({ stock, rejector }) => {
      setProposalModal(null);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: "system",
          text: `⚠️ 상대방이 [${stock.name}] 제안을 보류하고 다른 종목을 찾기로 했습니다.`
        }
      ]);
    };

    // 실시간 채팅 수신
    const handleReceiveChat = (msg) => {
      setMessages(prev => [...prev, msg]);
    };

    // 상대방이 AI 수석 심판관 호출 시 양쪽 동시 이동
    const handleEvaluationStarted = ({ basket: finalBasket }) => {
      onCompleteCollaboration(finalBasket);
    };

    // 파트너 연결 끊김
    const handlePartnerDisconnected = () => {
      alert("상대방의 연결이 끊어졌습니다.");
    };

    socket.on('stock_proposed', handleStockProposed);
    socket.on('stock_accepted', handleStockAccepted);
    socket.on('stock_rejected', handleStockRejected);
    socket.on('receive_chat', handleReceiveChat);
    socket.on('evaluation_started', handleEvaluationStarted);
    socket.on('partner_disconnected', handlePartnerDisconnected);

    return () => {
      socket.off('stock_proposed', handleStockProposed);
      socket.off('stock_accepted', handleStockAccepted);
      socket.off('stock_rejected', handleStockRejected);
      socket.off('receive_chat', handleReceiveChat);
      socket.off('evaluation_started', handleEvaluationStarted);
      socket.off('partner_disconnected', handlePartnerDisconnected);
    };
  }, [isRealMatch, socket, onCompleteCollaboration]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sectors = ["전체", ...new Set(MOCK_STOCKS.map(s => s.sector.split('/')[0].trim()))];

  const filteredStocks = MOCK_STOCKS.filter(stock => {
    const isAlreadyInBasket = basket.some(b => b?.code === stock.code);
    if (isAlreadyInBasket) return false;

    const matchesSearch = 
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.code.includes(searchQuery) ||
      stock.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSector = 
      selectedSector === "전체" || 
      stock.sector.includes(selectedSector);

    return matchesSearch && matchesSector;
  });

  // ==========================================
  // 시뮬레이션 봇 전용 역제안 트리거
  // ==========================================
  const triggerSimulationBotProposal = () => {
    setTimeout(() => {
      const candidateCode = partner.suggestStock || "005380";
      const candidateStock = MOCK_STOCKS.find(s => s.code === candidateCode) || MOCK_STOCKS[2];
      
      let targetStock = candidateStock;
      if (basket[0]?.code === candidateStock.code) {
        targetStock = MOCK_STOCKS.find(s => s.code === "033780") || MOCK_STOCKS[8];
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: "partner",
          name: partnerName,
          avatar: partnerAvatar,
          text: `[${targetStock.name}]을 두 번째 종목으로 역제안합니다! 제 누적 수익률 ${partner.returnRate} 노하우를 담은 황금 종목입니다.`
        }
      ]);

      setProposalModal({
        stock: targetStock,
        slotIndex: 1,
        proposer: partner,
        reason: partner.suggestReason || "수급 모멘텀과 밸류업 하방 지지력이 압도적인 종목입니다."
      });
    }, 1500);
  };

  // ==========================================
  // 사용자 종목 제안
  // ==========================================
  const handleProposeStock = (stock) => {
    const emptyIndex = basket.findIndex(item => item === null);
    if (emptyIndex === -1) return;

    if (isRealMatch && socket) {
      // 실제 2인 모드: 상대방에게 소켓 이벤트 전송
      socket.emit('propose_stock', {
        roomId,
        slotIndex: emptyIndex,
        stock,
        userProfile
      });

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: "user",
          name: userProfile.nickname,
          avatar: userProfile.avatar,
          text: `[${stock.name}]을 슬롯 0${emptyIndex + 1}번에 제안했습니다. 파트너 승인 대기 중...`
        }
      ]);
    } else {
      // AI 시뮬레이션 모드
      if (emptyIndex === 0) {
        const newBasket = [...basket];
        newBasket[0] = stock;
        setBasket(newBasket);

        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            sender: "user",
            name: userProfile.nickname,
            avatar: userProfile.avatar,
            text: `첫 번째 종목으로 [${stock.name}] 제안합니다!`
          }
        ]);

        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: "partner",
              name: partnerName,
              avatar: partnerAvatar,
              text: `훌륭한 안목이십니다! ${stock.name} 즉시 승인하고 제 2번째 추천 들어갑니다 👍`
            }
          ]);
          triggerSimulationBotProposal();
        }, 900);
      } else {
        const newBasket = [...basket];
        newBasket[emptyIndex] = stock;
        setBasket(newBasket);

        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            sender: "user",
            name: userProfile.nickname,
            avatar: userProfile.avatar,
            text: `[${stock.name}] 추가 제안합니다!`
          }
        ]);

        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: "partner",
              name: partnerName,
              avatar: partnerAvatar,
              text: partner.replies?.onFinalAgree || "완벽한 포트폴리오입니다! AI 심판관에게 바로 넘겨보죠 🚀"
            }
          ]);
        }, 900);
      }
    }
  };

  // ==========================================
  // 제안 승인
  // ==========================================
  const handleAcceptProposal = () => {
    if (!proposalModal) return;
    const { stock, slotIndex } = proposalModal;

    if (isRealMatch && socket) {
      socket.emit('accept_stock', {
        roomId,
        slotIndex,
        stock,
        userProfile
      });
    } else {
      const newBasket = [...basket];
      newBasket[slotIndex] = stock;
      setBasket(newBasket);

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: "user",
          name: userProfile.nickname,
          avatar: userProfile.avatar,
          text: `챌린저 랭커님의 [${stock.name}] 제안을 승인했습니다!`
        },
        {
          id: Date.now() + 1,
          sender: "partner",
          name: partnerName,
          avatar: partnerAvatar,
          text: `감사합니다! 이제 마지막 1종목만 멋지게 채우면 포트폴리오 완성입니다 💪`
        }
      ]);
    }

    setProposalModal(null);
  };

  // ==========================================
  // 제안 거절
  // ==========================================
  const handleRejectProposal = () => {
    if (!proposalModal) return;
    const { stock } = proposalModal;

    if (isRealMatch && socket) {
      socket.emit('reject_stock', {
        roomId,
        stock,
        userProfile
      });
    } else {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: "user",
          name: userProfile.nickname,
          avatar: userProfile.avatar,
          text: `[${stock.name}]도 좋지만, 다른 종목을 직접 찾아보겠습니다!`
        },
        {
          id: Date.now() + 1,
          sender: "partner",
          name: partnerName,
          avatar: partnerAvatar,
          text: `존중합니다! 원하시는 다른 종목을 직접 골라 제안해주세요 🙂`
        }
      ]);
    }
    setProposalModal(null);
  };

  // ==========================================
  // 실시간 채팅 및 이모지 전송
  // ==========================================
  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMsg = {
      id: Date.now(),
      sender: "user",
      name: userProfile.nickname,
      avatar: userProfile.avatar,
      text: userText
    };

    setMessages(prev => [...prev, newMsg]);
    setChatInput("");

    if (isRealMatch && socket) {
      // 실제 소켓 전송
      socket.emit('send_chat', {
        roomId,
        message: {
          id: Date.now(),
          sender: "partner",
          name: userProfile.nickname,
          avatar: userProfile.avatar,
          text: userText
        }
      });
    } else {
      // 봇 자동 리액션
      setTimeout(() => {
        const botReplies = [
          "챌린저 랭커 관점에서도 아주 정확한 시장 분석입니다!",
          "데이터와 외국인 수급이 정확히 일치하는 날카로운 포인트네요.",
          "우리 듀오 호흡이 기가 막힙니다. 알파독도 감탄할 것 같네요 🤝",
          "미션 정합성을 극대화하는 최고의 선택지입니다!"
        ];
        const randomReply = botReplies[Math.floor(Math.random() * botReplies.length)];
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "partner",
            name: partnerName,
            avatar: partnerAvatar,
            text: randomReply
          }
        ]);
      }, 1000);
    }
  };

  const handleSendEmoji = (emoji) => {
    const newMsg = {
      id: Date.now(),
      sender: "user",
      name: userProfile.nickname,
      avatar: userProfile.avatar,
      text: emoji
    };
    setMessages(prev => [...prev, newMsg]);

    if (isRealMatch && socket) {
      socket.emit('send_chat', {
        roomId,
        message: {
          id: Date.now(),
          sender: "partner",
          name: userProfile.nickname,
          avatar: userProfile.avatar,
          text: emoji
        }
      });
    }
  };

  // ==========================================
  // AI 심판관 호출
  // ==========================================
  const handleCallAiJudge = () => {
    if (isRealMatch && socket) {
      // 양쪽 동시 심사 전환
      socket.emit('trigger_ai_evaluation', { roomId, basket });
    } else {
      onCompleteCollaboration(basket);
    }
  };

  const isBasketComplete = basket.every(s => s !== null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-4">
      {/* 1. 상단 미션 및 타이머 바 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-gray-900/90 border border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold shrink-0">
            🎯
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400">공동 달성 미션</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                난이도: {mission.difficulty}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white">{mission.title}</h2>
          </div>
        </div>

        {/* 3분 타이머 & 파트너 배지 */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800 text-xs font-bold text-gray-300">
            {isRealMatch ? (
              <>
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>{partnerName}님과 실시간 2인 협업 중</span>
              </>
            ) : (
              <>
                <Crown className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span className="text-amber-300">TOP 0.1% {partnerName} 협업 중</span>
              </>
            )}
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold text-lg ${
            timeLeft <= 60 
              ? 'bg-red-500/10 border-red-500/50 text-red-400 animate-pulse' 
              : 'bg-gray-950 border-gray-800 text-emerald-400'
          }`}>
            <Clock className="w-5 h-5" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* 2. 공동 바스켓 3개 슬롯 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            공동 3종목 바스켓 현황 ({basket.filter(Boolean).length}/3)
          </span>
          {isBasketComplete && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" /> 3종목 바스켓 채결 완료!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[0, 1, 2].map((idx) => {
            const stock = basket[idx];
            return (
              <div
                key={idx}
                className={`relative min-h-[120px] rounded-2xl p-4 transition-all flex flex-col justify-between ${
                  stock
                    ? 'bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                    : 'bg-gray-950/60 border-2 border-dashed border-gray-800 flex items-center justify-center text-center'
                }`}
              >
                {stock ? (
                  <>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                            SLOT 0{idx + 1}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">{stock.code}</span>
                        </div>
                        <h4 className="text-base font-extrabold text-white">{stock.name}</h4>
                        <span className="text-xs text-gray-400">{stock.sector}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">
                          {stock.price.toLocaleString()}원
                        </div>
                        <div className={`text-xs font-semibold ${stock.change >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
                          {stock.change >= 0 ? `+${stock.change}%` : `${stock.change}%`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      {stock.tags.slice(0, 2).map((t, tidx) => (
                        <span key={tidx} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500 text-xs py-4">
                    <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center mx-auto mb-1 text-gray-400 font-bold">
                      {idx + 1}
                    </div>
                    <span>{idx === 0 ? '첫 번째 종목 제안 대기' : idx === 1 ? '두 번째 종목 제안/협의' : '마지막 3번째 종목 대기'}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 하단 레이아웃: 종목 탐색기 & 실시간 채팅 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 좌측 종목 탐색기 (7컬럼) */}
        <div className="lg:col-span-7 bg-gray-900/90 border border-gray-800 rounded-3xl p-4 sm:p-5 flex flex-col h-[520px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
              <span>국내 주요 종목 실시간 시세 후보군</span>
              <span className="text-[11px] text-emerald-400 font-semibold">• 실제 시세 연동</span>
            </h3>
          </div>

          {/* 검색창 & 섹터 필터 */}
          <div className="space-y-2 mb-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="종목명, 코드, 태그로 빠른 검색 (예: 삼성전자, HBM, 현대차)"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {sectors.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSelectedSector(sec)}
                  className={`px-2.5 py-1 rounded-lg shrink-0 font-medium transition ${
                    selectedSector === sec
                      ? 'bg-emerald-500 text-black font-bold'
                      : 'bg-gray-800/80 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          {/* 종목 카드 리스트 */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredStocks.map((stock) => (
              <div
                key={stock.code}
                className="p-3 rounded-2xl bg-gray-950/70 border border-gray-800/80 hover:border-gray-700 transition flex items-center justify-between gap-3 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-extrabold text-sm text-white truncate">{stock.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{stock.code}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-800 text-gray-400">
                      {stock.sector.split('/')[0]}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate mb-1">
                    {stock.description}
                  </p>
                  <div className="flex items-center gap-1 flex-wrap">
                    {stock.tags.slice(0, 3).map((tag, tidx) => (
                      <span key={tidx} className="text-[9px] text-emerald-400/90 bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-900/40">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-white mb-0.5">
                    {stock.price.toLocaleString()}원
                  </div>
                  <div className={`text-[11px] font-semibold mb-2 ${stock.change >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
                    {stock.change >= 0 ? `+${stock.change}%` : `${stock.change}%`}
                  </div>
                  <button
                    disabled={isBasketComplete}
                    onClick={() => handleProposeStock(stock)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/40 text-xs font-bold transition disabled:opacity-40 disabled:pointer-events-none"
                  >
                    제안하기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 우측 실시간 듀오 채팅 (5컬럼) */}
        <div className="lg:col-span-5 bg-gray-900/90 border border-gray-800 rounded-3xl p-4 flex flex-col h-[520px]">
          {/* 헤더 */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{partnerAvatar}</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-white">{partnerName}</span>
                  {!isRealMatch && <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                  {isRealMatch ? (
                    <span className="text-emerald-400">● 실시간 접속 중</span>
                  ) : (
                    <>
                      <span className="font-bold text-red-400">수익률 {partner.returnRate}</span>
                      <span>•</span>
                      <span className="text-emerald-400">승률 {partner.winRate}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <span className="text-[10px] px-2.5 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700 font-semibold">
              {isRealMatch ? '실시간 2인 룸' : 'AI 챌린저'}
            </span>
          </div>

          {/* 채팅 말풍선 리스트 */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {messages.map((msg) => {
              if (msg.sender === "system") {
                return (
                  <div key={msg.id} className="text-center my-2">
                    <span className="text-[10px] bg-gray-800/80 text-gray-400 px-2.5 py-1 rounded-full border border-gray-700/50">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              const isMe = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} text-xs`}
                >
                  <div className="flex items-center gap-1 mb-0.5 px-1">
                    <span className="text-gray-400 text-[10px]">{msg.name}</span>
                  </div>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl leading-relaxed ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </div>

          {/* 퀵 이모지 바 */}
          <div className="flex items-center gap-1.5 py-2 border-t border-gray-800/80">
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleSendEmoji(emoji)}
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm flex items-center justify-center transition"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* 채팅 인풋 */}
          <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="파트너와 실시간 의견 조율하기..."
              className="flex-1 px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="p-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-bold transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 4. 3종목 완성 시 활성화되는 AI 수석 심판관 호출 버튼 */}
      {isBasketComplete && (
        <div className="pt-2 animate-scale-up">
          <button
            onClick={handleCallAiJudge}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-black font-black text-lg flex items-center justify-center gap-2 shadow-2xl shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <Sparkles className="w-6 h-6" />
            <span>AI 심판관 알파독(AlphaDog) 호출하기 {isRealMatch && '(양쪽 동시 심사 전환)'}</span>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* 5. 상대방 종목 제안 팝업 모달 */}
      {proposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-gray-900 border-2 border-emerald-500/80 rounded-3xl p-6 shadow-2xl text-slate-100 animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{proposalModal.proposer?.avatar || partnerAvatar}</span>
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                    파트너의 종목 제안 도착!
                  </span>
                  <h3 className="text-lg font-black text-white mt-0.5">
                    {proposalModal.stock.name} 제안
                  </h3>
                </div>
              </div>
            </div>

            {/* 추천 종목 정보 카드 */}
            <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800 mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-gray-400">{proposalModal.stock.code}</span>
                <span className="text-xs text-gray-400">{proposalModal.stock.sector}</span>
              </div>
              <div className="flex items-baseline justify-between mb-2">
                <h4 className="text-xl font-extrabold text-white">{proposalModal.stock.name}</h4>
                <div className="text-right">
                  <span className="text-sm font-bold text-white mr-2">
                    {proposalModal.stock.price.toLocaleString()}원
                  </span>
                  <span className={`text-xs font-semibold ${proposalModal.stock.change >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
                    {proposalModal.stock.change >= 0 ? `+${proposalModal.stock.change}%` : `${proposalModal.stock.change}%`}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-300 bg-gray-900 p-2.5 rounded-xl border border-gray-800 leading-relaxed">
                💡 <strong>제안 사유:</strong> {proposalModal.reason}
              </div>
            </div>

            {/* 승인 / 거절 버튼 */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleRejectProposal}
                className="py-3 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs transition"
              >
                다른 종목 찾기
              </button>
              <button
                type="button"
                onClick={handleAcceptProposal}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" /> 제안 승인하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
