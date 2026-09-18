import React, { useState, useEffect } from 'react';
import { MISSIONS, BOT_PARTNERS } from '../data/stocks';
import { Radar, Sparkles, CheckCircle2, Shuffle, ArrowRight, ShieldAlert, Cpu, Coins } from 'lucide-react';

export default function StepMatching({ userProfile, onMatchComplete }) {
  // 단계: 'searching' -> 'matched' -> 'roulette' -> 'ready'
  const [phase, setPhase] = useState('searching');
  const [partner, setPartner] = useState(null);
  const [selectedMission, setSelectedMission] = useState(null);
  const [rouletteIndex, setRouletteIndex] = useState(0);

  useEffect(() => {
    // 1단계: 1.8초 동안 레이더 검색 후 파트너 결정
    const searchTimer = setTimeout(() => {
      const pickedPartner = BOT_PARTNERS[Math.floor(Math.random() * BOT_PARTNERS.length)];
      setPartner(pickedPartner);
      setPhase('matched');
    }, 1800);

    return () => clearTimeout(searchTimer);
  }, []);

  useEffect(() => {
    if (phase === 'matched') {
      // 1초 후 미션 룰렛 시작
      const rouletteStartTimer = setTimeout(() => {
        setPhase('roulette');
      }, 1000);
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
    <div className="max-w-xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[70vh] animate-fade-in text-center">
      {/* 1. 레이더 스캔 상태 */}
      {phase === 'searching' && (
        <div className="space-y-6">
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping opacity-60"></div>
            <div className="absolute inset-4 rounded-full border border-emerald-500/30 animate-pulse"></div>
            <div className="absolute inset-10 rounded-full border border-emerald-500/40"></div>
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-3xl">{userProfile.avatar}</span>
            </div>
            {/* 회전 레이더 빔 */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-emerald-500/10 to-transparent animate-spin"></div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-2">익명 파트너 탐색 중...</h2>
            <p className="text-sm text-gray-400">
              {userProfile.style.label} 성향과 시너지를 낼 수 있는 최적의 투자자를 매칭하고 있습니다.
            </p>
          </div>
        </div>
      )}

      {/* 2. 파트너 매칭 완료 직후 */}
      {phase === 'matched' && (
        <div className="space-y-6 animate-scale-up">
          <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-400 mb-2">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">매칭 성공!</h2>
          <div className="p-4 rounded-2xl bg-gray-900 border border-emerald-500/40 text-center max-w-sm mx-auto">
            <div className="text-4xl mb-2">{partner?.avatar}</div>
            <div className="font-bold text-lg text-emerald-300">{partner?.name}</div>
            <div className="text-xs text-gray-400 mt-1">{partner?.persona}</div>
          </div>
          <p className="text-xs text-gray-400">잠시 후 오늘의 미션 룰렛이 시작됩니다...</p>
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
            두 투자자가 함께 해결할 3종목 테마를 선정하고 있습니다...
          </p>
        </div>
      )}

      {/* 4. 매칭 및 미션 최종 확정 (Ready) */}
      {phase === 'ready' && partner && selectedMission && (
        <div className="w-full max-w-md space-y-6 animate-scale-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>듀오 매칭 및 미션 배정 완료!</span>
          </div>

          {/* 듀오 프로필 카드 */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-gray-900/90 border border-gray-800">
            <div className="p-3 rounded-xl bg-gray-950/80 border border-gray-800 flex flex-col items-center">
              <span className="text-3xl mb-1">{userProfile.avatar}</span>
              <span className="text-xs font-bold text-white">{userProfile.nickname} (나)</span>
              <span className="text-[10px] text-gray-400 mt-0.5">{userProfile.style.label}</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-950/80 border border-emerald-500/30 flex flex-col items-center">
              <span className="text-3xl mb-1">{partner.avatar}</span>
              <span className="text-xs font-bold text-emerald-300">{partner.name}</span>
              <span className="text-[10px] text-emerald-400/80 mt-0.5">{partner.styleTag}</span>
            </div>
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
            <p className="text-xs text-gray-300 mb-3">
              {selectedMission.subtitle}
            </p>
            <div className="text-[11px] text-gray-400 bg-gray-900/90 p-2.5 rounded-xl border border-gray-800 leading-relaxed mb-3">
              {selectedMission.description}
            </div>
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
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-black font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <span>협업 룸 입장 (제한시간 3분 시작)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
