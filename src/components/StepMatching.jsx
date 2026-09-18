import React, { useState, useEffect } from 'react';
import { MISSIONS, BOT_PARTNERS } from '../data/stocks';
import RankEmblem from './RankEmblem';
import { Radar, Sparkles, CheckCircle2, Shuffle, ArrowRight, ShieldAlert, Cpu, Coins, Crown } from 'lucide-react';

export default function StepMatching({ userProfile, onMatchComplete }) {
  // 단계: 'searching' -> 'matched' -> 'roulette' -> 'ready'
  const [phase, setPhase] = useState('searching');
  const [partner, setPartner] = useState(null);
  const [selectedMission, setSelectedMission] = useState(null);
  const [rouletteIndex, setRouletteIndex] = useState(0);

  useEffect(() => {
    // 1단계: 1.8초 동안 레이더 검색 후 최상급 챌린저 파트너 매칭
    const searchTimer = setTimeout(() => {
      // 최상급 챌린저 봇 선정
      const pickedPartner = BOT_PARTNERS[0]; // 여의도_천상계_고수 (CHALLENGER)
      setPartner(pickedPartner);
      setPhase('matched');
    }, 1800);

    return () => clearTimeout(searchTimer);
  }, []);

  useEffect(() => {
    if (phase === 'matched') {
      // 1.5초 후 미션 룰렛 시작 (앰블럼을 충분히 감상할 수 있도록 시간 부여)
      const rouletteStartTimer = setTimeout(() => {
        setPhase('roulette');
      }, 1600);
      return () => clearTimeout(rouletteStartTimer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'roulette') {
      // 룰렛 회전 애니메이션
      let counter = 0;
      const interval = setInterval(() => {
        setRouletteIndex(prev => (prev + 1) % MISSIONS.length);
        counter++;
        if (counter > 15) {
          clearInterval(interval);
          const finalMission = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
          setSelectedMission(finalMission);
          setPhase('ready');
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleEnterRoom = () => {
    if (partner && selectedMission) {
      onMatchComplete({
        partner,
        mission: selectedMission
      });
    }
  };

  const getMissionIcon = (iconName) => {
    switch(iconName) {
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-red-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-cyan-400" />;
      default: return <Coins className="w-5 h-5 text-yellow-400" />;
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[70vh] animate-fade-in text-center">
      {/* 1. 레이더 스캔 상태 */}
      {phase === 'searching' && (
        <div className="space-y-6">
          <div className="relative w-52 h-52 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-ping opacity-60"></div>
            <div className="absolute inset-4 rounded-full border border-amber-500/30 animate-pulse"></div>
            <div className="absolute inset-10 rounded-full border border-amber-500/40"></div>
            <div className="w-24 h-24 rounded-full bg-amber-500/10 border-2 border-amber-400/60 flex items-center justify-center shadow-xl shadow-amber-500/20">
              <span className="text-4xl">{userProfile.avatar}</span>
            </div>
            {/* 회전 레이더 빔 */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-amber-400/20 to-transparent animate-spin"></div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black mb-2 animate-pulse">
              <Crown className="w-3.5 h-3.5 fill-amber-300" />
              <span>TOP 0.1% 챌린저 천상계 대기열 스캔 중...</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">최상급 랭커 파트너 매칭</h2>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              수익률 상위 0.1% 전설의 슈퍼개미와 듀오 포트폴리오를 작성할 기회를 탐색하고 있습니다.
            </p>
          </div>
        </div>
      )}

      {/* 2. 파트너 매칭 완료 직후 - 화려한 앰블럼 등장 */}
      {phase === 'matched' && partner && (
        <div className="space-y-5 animate-scale-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-black text-xs shadow-lg shadow-amber-500/20 animate-bounce">
            <Crown className="w-4 h-4 fill-amber-300" />
            <span>👑 천상계 최상급 랭커 매칭 성공!</span>
          </div>

          <h2 className="text-3xl font-black text-white tracking-tight">
            전설의 듀오 결성!
          </h2>

          <div className="p-6 rounded-3xl bg-gradient-to-b from-gray-900 via-amber-950/40 to-gray-950 border-2 border-amber-400/70 shadow-2xl shadow-amber-500/20 text-center max-w-sm mx-auto">
            <div className="text-5xl mb-3">{partner.avatar}</div>
            <div className="font-black text-xl text-amber-300 mb-1">{partner.name}</div>
            <div className="text-xs text-amber-200/80 mb-4 font-semibold">{partner.rankTitle}</div>

            {/* 수익률 등급 앰블럼 */}
            <div className="flex justify-center">
              <RankEmblem 
                tier={partner.tier} 
                returnRate={partner.returnRate} 
                winRate={partner.winRate} 
                size="md" 
              />
            </div>
          </div>

          <p className="text-xs text-gray-400 animate-pulse">
            잠시 후 공동 미션 룰렛이 시작됩니다...
          </p>
        </div>
      )}

      {/* 3. 미션 룰렛 회전 중 */}
      {phase === 'roulette' && (
        <div className="space-y-6 animate-fade-in w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Shuffle className="w-4 h-4 animate-spin" />
            <span>오늘의 미션 추첨 룰렛</span>
          </div>

          <div className="p-6 rounded-3xl bg-gray-900 border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20 max-w-md mx-auto">
            <div className="text-sm font-bold text-gray-400 mb-1">
              미션 {rouletteIndex + 1}
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mb-2">
              {MISSIONS[rouletteIndex].title}
            </div>
            <div className="text-xs text-cyan-300">
              {MISSIONS[rouletteIndex].subtitle}
            </div>
          </div>

          <p className="text-xs text-gray-400 animate-pulse">
            최상급 랭커와 함께 돌파할 3종목 테마를 선정하고 있습니다...
          </p>
        </div>
      )}

      {/* 4. 매칭 및 미션 최종 확정 (Ready) */}
      {phase === 'ready' && partner && selectedMission && (
        <div className="w-full max-w-md space-y-5 animate-scale-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>최상급 랭커 듀오 & 미션 확정!</span>
          </div>

          {/* 듀오 프로필 카드 */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-gray-900/90 border border-gray-800">
            <div className="p-3 rounded-xl bg-gray-950/80 border border-gray-800 flex flex-col items-center justify-between">
              <span className="text-3xl mb-1">{userProfile.avatar}</span>
              <span className="text-xs font-bold text-white">{userProfile.nickname} (나)</span>
              <span className="text-[10px] text-gray-400 mt-0.5">{userProfile.style.label}</span>
            </div>

            <div className="p-3 rounded-xl bg-gradient-to-b from-gray-950 to-amber-950/40 border border-amber-400/60 flex flex-col items-center justify-between">
              <span className="text-3xl mb-1">{partner.avatar}</span>
              <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                <Crown className="w-3 h-3 fill-amber-300" />
                {partner.name}
              </span>
              <span className="text-[10px] font-bold text-red-400 mt-0.5">
                수익률 {partner.returnRate}
              </span>
            </div>
          </div>

          {/* 앰블럼 단독 노출 */}
          <div className="flex justify-center">
            <RankEmblem 
              tier={partner.tier} 
              returnRate={partner.returnRate} 
              winRate={partner.winRate} 
              size="md" 
            />
          </div>

          {/* 배정된 미션 카드 */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-gray-900 to-gray-950 border border-cyan-500/30 text-left">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getMissionIcon(selectedMission.icon)}
                <span className="text-xs font-bold text-cyan-400">배정된 공동 미션</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
                난이도: {selectedMission.difficulty}
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-white mb-1">
              {selectedMission.title}
            </h3>
            <p className="text-xs text-gray-300 mb-2">
              {selectedMission.subtitle}
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-gray-400">권장 섹터:</span>
              {selectedMission.targetSectors.map((sec, idx) => (
                <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                  {sec}
                </span>
              ))}
            </div>
          </div>

          {/* 입장 버튼 */}
          <button
            onClick={handleEnterRoom}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-black font-black text-base flex items-center justify-center gap-2 shadow-2xl shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <Crown className="w-5 h-5 fill-black" />
            <span>최상급 랭커와 3분 협업 시작</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
