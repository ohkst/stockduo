import React, { useState, useEffect, useRef } from 'react';
import { MOCK_STOCKS } from '../data/stocks';
import RankEmblem from './RankEmblem';
import { 
  Clock, Search, Check, Send, Sparkles, AlertCircle, Bot, ThumbsUp, Flame, 
  Rocket, X, HelpCircle, ChevronRight, Award, Crown
} from 'lucide-react';

const QUICK_EMOJIS = ["👍", "🚀", "🔥", "💎", "👏", "👀"];

export default function StepCollaboration({ userProfile, partnerBot, mission, onCompleteCollaboration }) {
  // 3개 슬롯 상태 (배열: Stock 객체 3개)
  const [basket, setBasket] = useState([null, null, null]);

  // 3분 타이머 (180초)
  const [timeLeft, setTimeLeft] = useState(180);

  // 검색 및 필터
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("전체");

  // 채팅 내역
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "system",
      text: `[${mission.title}] 미션 룸에 입장했습니다. 전국 1위 챌린저 랭커와 함께 3분 안에 완성하세요!`
    },
    {
      id: 2,
      sender: "partner",
      name: partnerBot.name,
      avatar: partnerBot.avatar,
      text: `반갑습니다 ${userProfile.nickname}님! ${partnerBot.rankTitle}(수익률 ${partnerBot.returnRate})입니다. 첫 번째 핵심 종목 먼저 골라주시면 제가 즉시 수급 분석해드리겠습니다!`
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatBottomRef = useRef(null);

  // 파트너 봇 역제안 모달 상태
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 고유 섹터 리스트
  const sectors = ["전체", ...new Set(MOCK_STOCKS.map(s => s.sector.split('/')[0].trim()))];

  // 필터링된 주식 목록
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

  // 슬롯 1 완료 후 1.5초 뒤 봇 역제안 트리거
  const triggerPartnerProposal = () => {
    setTimeout(() => {
      const candidateCode = partnerBot.suggestStock || "005380";
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
          name: partnerBot.name,
          avatar: partnerBot.avatar,
          text: `[${targetStock.name}]을 두 번째 종목으로 역제안합니다! 제 누적 수익률 ${partnerBot.returnRate} 노하우를 담은 황금 종목입니다.`
        }
      ]);

      // 모달 오픈
      setProposalModal({
        stock: targetStock,
        reason: partnerBot.suggestReason || "수급 모멘텀과 밸류업 하방 지지력이 압도적인 종목입니다."
      });
    }, 1500);
  };

  // 사용자 종목 제안
  const handleProposeStock = (stock) => {
    const emptyIndex = basket.findIndex(item => item === null);
    if (emptyIndex === -1) return;

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
        const replyText = partnerBot.replies?.onFirstSelect
          ? partnerBot.replies.onFirstSelect(stock)
          : `역시 훌륭한 안목이십니다! ${stock.name} 즉시 승인하고 제 2번째 추천 들어갑니다 👍`;

        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "partner",
            name: partnerBot.name,
            avatar: partnerBot.avatar,
            text: replyText
          }
        ]);

        triggerPartnerProposal();
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
          text: `마지막 3번째 종목으로 [${stock.name}] 추가 제안합니다!`
        }
      ]);

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: "partner",
            name: partnerBot.name,
            avatar: partnerBot.avatar,
            text: partnerBot.replies?.onFinalAgree || "완벽한 포트폴리오입니다! AI 심판관 알파독에게 바로 넘겨보죠 🚀"
          }
        ]);
      }, 900);
    }
  };

  // 봇 역제안 승인
  const handleAcceptProposal = () => {
    if (!proposalModal) return;
    const stock = proposalModal.stock;
    
    const emptyIndex = basket.findIndex(item => item === null);
    if (emptyIndex !== -1) {
      const newBasket = [...basket];
      newBasket[emptyIndex] = stock;
      setBasket(newBasket);
    }

    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        name: userProfile.nickname,
        avatar: userProfile.avatar,
        text: `챌린저 랭커님의 [${stock.name}] 제안을 승인했습니다! 확실히 믿음이 가네요.`
      },
      {
        id: Date.now() + 1,
        sender: "partner",
        name: partnerBot.name,
        avatar: partnerBot.avatar,
        text: `감사합니다! 이제 마지막 1종목만 멋지게 채우면 초과수익 보장 포트폴리오 완성입니다 💪`
      }
    ]);

    setProposalModal(null);
  };

  // 봇 역제안 거절
  const handleRejectProposal = () => {
    if (!proposalModal) return;
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        name: userProfile.nickname,
        avatar: userProfile.avatar,
        text: `[${proposalModal.stock.name}]도 좋지만, 다른 종목을 직접 찾아보겠습니다!`
      },
      {
        id: Date.now() + 1,
        sender: "partner",
        name: partnerBot.name,
        avatar: partnerBot.avatar,
        text: `존중합니다! 원하시는 다른 최적의 종목을 직접 골라 제안해주세요 🙂`
      }
    ]);
    setProposalModal(null);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        name: userProfile.nickname,
        avatar: userProfile.avatar,
        text: userText
      }
    ]);
    setChatInput("");

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
          name: partnerBot.name,
          avatar: partnerBot.avatar,
          text: randomReply
        }
      ]);
    }, 1000);
  };

  const handleSendEmoji = (emoji) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        name: userProfile.nickname,
        avatar: userProfile.avatar,
        text: emoji
      }
    ]);
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

        {/* 3분 타이머 & 랭커 동반 배지 */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-bold">
            <Crown className="w-3.5 h-3.5 fill-amber-300" />
            <span>TOP 0.1% {partnerBot.name} 협업 중</span>
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
                    <span>{idx === 0 ? '첫 번째 종목 제안 대기' : idx === 1 ? '챌린저 랭커 역제안 협의' : '마지막 3번째 종목 대기'}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 하단 레이아웃: 좌측 종목 검색창 / 우측 실시간 듀오 채팅 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 좌측 종목 탐색기 (7컬럼) */}
        <div className="lg:col-span-7 bg-gray-900/90 border border-gray-800 rounded-3xl p-4 sm:p-5 flex flex-col h-[520px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
              <span>증권사 시총 상위 유망 후보군</span>
              <span className="text-[11px] text-gray-400 font-normal">({filteredStocks.length}개)</span>
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
                placeholder="종목명, 코드, 태그로 빠른 검색 (예: 삼전, HBM, 배당)"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            
            {/* 섹터 필터 탭 */}
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

        {/* 우측 실시간 듀오 채팅 (상대방 앰블럼 헤더 장착) */}
        <div className="lg:col-span-5 bg-gray-900/90 border border-gray-800 rounded-3xl p-4 flex flex-col h-[520px]">
          {/* 채팅 헤더 - 앰블럼 및 수익률 정보 노출 */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{partnerBot.avatar}</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-amber-300">{partnerBot.name}</span>
                  <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </div>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="font-bold text-red-400">수익률 {partnerBot.returnRate}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-emerald-400 font-semibold">승률 {partnerBot.winRate}</span>
                </div>
              </div>
            </div>

            <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-black">
              TOP 0.1% 챌린저
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

          {/* 채팅 입력 인풋 */}
          <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="챌린저 랭커와 실시간 의견 조율하기..."
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
            onClick={() => onCompleteCollaboration(basket)}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-black font-black text-lg flex items-center justify-center gap-2 shadow-2xl shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <Crown className="w-6 h-6 fill-black" />
            <span>AI 심판관 알파독(AlphaDog) 호출하기 (챌린저 듀오 종합 심사)</span>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* 5. 👑 최상급 챌린저 랭커의 역제안 도착 팝업 모달 */}
      {proposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-gradient-to-b from-gray-900 via-amber-950/30 to-gray-950 border-2 border-amber-400/80 rounded-3xl p-6 shadow-2xl text-slate-100 animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{partnerBot.avatar}</span>
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-black border border-amber-400/40">
                    👑 TOP 0.1% 챌린저의 특급 역제안!
                  </span>
                  <h3 className="text-lg font-black text-white mt-0.5">
                    {partnerBot.name}의 추천 종목
                  </h3>
                </div>
              </div>
            </div>

            {/* 상대방 앰블럼 미니 버전 */}
            <div className="mb-3">
              <RankEmblem 
                tier={partnerBot.tier} 
                returnRate={partnerBot.returnRate} 
                winRate={partnerBot.winRate} 
                size="sm" 
              />
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
              <div className="text-xs text-amber-200/90 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30 leading-relaxed">
                👑 <strong>랭커 분석 코멘트:</strong> "{proposalModal.reason}"
              </div>
            </div>

            {/* 승인 / 거절 버튼 */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleRejectProposal}
                className="py-3 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs transition"
              >
                직접 고르기
              </button>
              <button
                type="button"
                onClick={handleAcceptProposal}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black text-xs transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" /> 랭커 제안 승인하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
