import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import RankEmblem from './RankEmblem';
import { 
  Trophy, Sparkles, Download, Share2, ExternalLink, RotateCcw, 
  TrendingUp, Shield, Zap, AlertTriangle, CheckCircle, ArrowRight, X, Crown
} from 'lucide-react';

export default function StepReport({ 
  userProfile, 
  partnerBot, 
  mission, 
  stocks, 
  aiReport, 
  onRestart 
}) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [mtsModalOpen, setMtsModalOpen] = useState(false);
  const [orderExecuted, setOrderExecuted] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const cardRef = useRef(null);

  // 폭죽 및 점수 카운트업
  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    const target = aiReport.chemistryScore || 92;
    const duration = 1200;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimatedScore(target);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [aiReport.chemistryScore]);

  // 인스타 카드 캡처 다운로드 (html2canvas)
  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    try {
      setIsCapturing(true);
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0B0F19',
        scale: 2,
        useCORS: true
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `StockDuo_Challenger_${userProfile.nickname}_Report.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Capture failed:", err);
      alert("카드 이미지 생성 중 오류가 발생했습니다.");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleExecuteBasketOrder = () => {
    setOrderExecuted(true);
  };

  const getRoleIcon = (roleName) => {
    if (roleName.includes("딜러")) return <Zap className="w-4 h-4 text-amber-400" />;
    if (roleName.includes("방패")) return <Shield className="w-4 h-4 text-blue-400" />;
    return <Sparkles className="w-4 h-4 text-purple-400" />;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
      {/* 1. 상단 액션 바 */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>새 매칭 시작</span>
        </button>

        <button
          onClick={handleDownloadCard}
          disabled={isCapturing}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-300 text-black text-xs font-black shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isCapturing ? '카드 생성 중...' : '챌린저 듀오 인증 카드 다운로드'}</span>
        </button>
      </div>

      {/* 2. 캡처 대상 종합 결과 카드 */}
      <div 
        ref={cardRef} 
        className="bg-gradient-to-b from-gray-900 via-gray-900 to-[#0B0F19] border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* 장식용 글로우 배경 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        {/* 상단 듀오 정보 및 미션 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-800/80 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
                {mission.title}
              </span>
              <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                <Crown className="w-3 h-3 fill-amber-300" />
                <span>TOP 0.1% 챌린저 협업 인증</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {aiReport.teamTitle}
            </h2>

            <div className="flex items-center gap-2 mt-2 text-xs text-gray-300">
              <span className="font-semibold">{userProfile.avatar} {userProfile.nickname}</span>
              <span className="text-gray-500">×</span>
              <span className="font-black text-amber-300">{partnerBot.avatar} {partnerBot.name}</span>
            </div>
          </div>

          {/* 상대방 수익률 등급 앰블럼 & 케미 점수 배지 */}
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            <RankEmblem 
              tier={partnerBot.tier} 
              returnRate={partnerBot.returnRate} 
              winRate={partnerBot.winRate} 
              size="md" 
            />

            <div className="flex items-center gap-3 bg-gray-950/90 border border-amber-400/50 p-3.5 rounded-2xl shadow-xl shrink-0">
              <Trophy className="w-7 h-7 text-yellow-400 animate-bounce" />
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">케미스트리 점수</div>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">
                  {animatedScore}<span className="text-base text-yellow-400 font-bold">점</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 수석 심판관 알파독 종합 팩폭 심사평 */}
        <div className="my-6 p-4 sm:p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🐕‍🦺</span>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              증권사 AI 수석 심판관 (AlphaDog) 종합 판정
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
            {aiReport.verdictSummary}
          </p>
        </div>

        {/* 3개 종목별 역할 분담 카드 */}
        <div className="space-y-2.5 my-6 relative z-10">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            포트폴리오 3종목 역할 분담 (Role Architecture)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiReport.roles.map((r, idx) => {
              const matchedStock = stocks.find(s => s.name === r.name) || stocks[idx];
              return (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-gray-950/80 border border-gray-800 hover:border-gray-700 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-gray-500">{matchedStock?.code}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 font-semibold">
                      SLOT 0{idx + 1}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-1">
                    <h4 className="font-black text-base text-white">{r.name}</h4>
                    <span className="text-xs font-bold text-gray-300">
                      {matchedStock?.price?.toLocaleString()}원
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 my-2">
                    {getRoleIcon(r.role)}
                    <span className="text-xs font-bold text-amber-300">
                      {r.role}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    {r.comment}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 주요 시뮬레이션 지표 4선 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-6 relative z-10">
          <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800 text-center">
            <div className="text-[10px] text-gray-400">예상 기대수익률</div>
            <div className="text-base sm:text-lg font-black text-red-400 mt-0.5">
              {aiReport.metrics?.expectedReturn}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800 text-center">
            <div className="text-[10px] text-gray-400">변동성 수준</div>
            <div className="text-base sm:text-lg font-black text-yellow-400 mt-0.5">
              {aiReport.metrics?.volatility}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800 text-center">
            <div className="text-[10px] text-gray-400">최대 낙폭 (MDD)</div>
            <div className="text-base sm:text-lg font-black text-blue-400 mt-0.5">
              {aiReport.metrics?.mdd}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-gray-950/60 border border-gray-800 text-center">
            <div className="text-[10px] text-gray-400">샤프 지수</div>
            <div className="text-base sm:text-lg font-black text-emerald-400 mt-0.5">
              {aiReport.metrics?.sharpeRatio}
            </div>
          </div>
        </div>

        {/* 시너지 포인트 & 리스크 경고 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10 text-xs">
          <div className="p-3.5 rounded-2xl bg-gray-950/80 border border-amber-950/60">
            <div className="font-bold text-amber-300 mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" /> 챌린저 듀오 시너지 포인트
            </div>
            <ul className="space-y-1.5 text-gray-300">
              {aiReport.synergyPoints?.map((p, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-400">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-gray-950/80 border border-yellow-950/60">
            <div className="font-bold text-yellow-400 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> 알파독 주의 경고
            </div>
            <ul className="space-y-1.5 text-gray-300">
              {aiReport.riskWarnings?.map((w, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-yellow-500">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 워터마크 푸터 */}
        <div className="mt-6 pt-4 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500">
          <span>한국투자증권 AX 경진대회 출품작 · StockDuo</span>
          <span>TrueFriend MTS Connected</span>
        </div>
      </div>

      {/* 3. 한국투자증권 MTS 연계 메인 배너 */}
      <div 
        onClick={() => setMtsModalOpen(true)}
        className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-blue-950/80 border-2 border-blue-500/50 hover:border-blue-400 shadow-2xl shadow-blue-500/10 cursor-pointer transition-all hover:scale-[1.01] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/30 shrink-0">
            한투
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 mb-1">
              <span>한국투자증권 MTS 연계</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              <span>모바일 실전 주문</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              한국투자증권 MTS 가서 완성된 3종목 매수하기
            </h3>
            <p className="text-xs text-blue-200/80 mt-0.5">
              챌린저와 합의된 3종목 바스켓을 한국투자증권 MTS에 1-클릭으로 바로 전송하세요.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-black text-sm flex items-center gap-1.5 shadow-lg shadow-blue-500/30 shrink-0"
        >
          <span>MTS 주문 열기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4. 한국투자증권 MTS 주문 팝업 모달 */}
      {mtsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-gray-900 border-2 border-blue-500/50 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100 animate-scale-up">
            <button
              onClick={() => {
                setMtsModalOpen(false);
                setOrderExecuted(false);
              }}
              className="absolute top-5 right-5 p-1 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white text-lg">
                한투
              </div>
              <div>
                <h3 className="text-lg font-black text-white">한국투자증권 MTS 주문 센터</h3>
                <p className="text-xs text-blue-300">TrueFriend 모바일 웹 & 앱 바스켓 주문</p>
              </div>
            </div>

            <div className="space-y-2 mb-5">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                바스켓 주문 종목 (3건)
              </div>
              {stocks.map((s, idx) => (
                <div
                  key={s.code}
                  className="p-3 rounded-xl bg-gray-950 border border-gray-800 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-white">{s.name}</span>
                      <span className="text-xs font-mono text-gray-400">{s.code}</span>
                    </div>
                    <span className="text-[11px] text-gray-400">현재가: {s.price.toLocaleString()}원</span>
                  </div>

                  <a
                    href="https://m.truefriend.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-semibold border border-blue-500/30 transition"
                  >
                    <span>한투 주문</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>

            {orderExecuted ? (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center mb-4 animate-scale-up">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-1.5" />
                <h4 className="font-black text-sm text-white">모의투자 바스켓 일괄 주문 전송 완료!</h4>
                <p className="text-xs text-emerald-300/90 mt-1">
                  선택하신 3종목이 한국투자증권 가상 계좌에 균등 비중(33.3%)으로 주문 접수되었습니다.
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleExecuteBasketOrder}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition mb-3"
              >
                <span>3종목 바스켓 일괄 매수 주문 실행 (시뮬레이션)</span>
              </button>
            )}

            <div className="pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
              <a
                href="https://www.truefriend.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-400 hover:underline"
              >
                한국투자증권 공식 웹사이트 열기 <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[10px] text-gray-500">TrueFriend Open API 규격</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
