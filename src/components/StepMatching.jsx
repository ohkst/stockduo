import React, { useState, useEffect } from 'react';
import { MISSIONS, BOT_PARTNERS } from '../data/stocks';
import RankEmblem from './RankEmblem';
import { 
  Radar, Sparkles, CheckCircle2, Shuffle, ArrowRight, ShieldAlert, Cpu, Coins, 
  Crown, Clock, Users, Bot, AlertTriangle 
} from 'lucide-react';

export default function StepMatching({ userProfile, socket, onMatchComplete, onSwitchToSimulation }) {
  const isRealMode = userProfile.mode === 'real';

  // 상태: 'searching' -> 'matched' -> 'roulette' -> 'ready'
  const [phase, setPhase] = useState('searching');
  const [partner, setPartner] = useState(null);
  const [selectedMission, setSelectedMission] = useState(null);
  const [rouletteIndex, setRouletteIndex] = useState(0);
  const [realRoomId, setRealRoomId] = useState(null);
  const [isHost, setIsHost] = useState(false);

  // 실제 매칭 10분 타이머 (600초)
  const [waitSeconds, setWaitSeconds] = useState(600);

  // 1. 소켓 이벤트 및 타이머 핸들링
  useEffect(() => {
    if (isRealMode && socket) {
      // 서버 대기열 참가
      socket.emit('join_queue', userProfile);

      // 상대방과 매칭 성공 수신
      const handleMatchFound = ({ roomId, partnerProfile, mission, isHost: hostStatus }) => {
        setRealRoomId(roomId);
        setPartner(partnerProfile);
        setSelectedMission(mission);
        setIsHost(hostStatus);
        setPhase('matched');
      };

      socket.on('match_found', handleMatchFound);

      // 10분 카운트다운 타이머
      const timer = setInterval(() => {
        setWaitSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        socket.off('match_found', handleMatchFound);
        clearInterval(timer);
      };
    } else if (!isRealMode) {
      // AI 시뮬레이션 모드: 1.8초 후 즉시 챌린저 봇 매칭
      const simTimer = setTimeout(() => {
        const picked = BOT_PARTNERS[0];
        setPartner(picked);
        setPhase('matched');
      }, 1800);

      return () => clearTimeout(simTimer);
    }
  }, [isRealMode, socket]);

  // 매칭 완료 후 룰렛 단계 전환
  useEffect(() => {
    if (phase === 'matched') {
      const rouletteTimer = setTimeout(() => {
        setPhase('roulette');
      }, 1500);
      return () => clearTimeout(rouletteTimer);
    }
  }, [phase]);

  // 룰렛 회전 연출
  useEffect(() => {
    if (phase === 'roulette') {
      let counter = 0;
      const interval = setInterval(() => {
        setRouletteIndex(prev => (prev + 1) % MISSIONS.length);
        counter++;
        if (counter > 14) {
          clearInterval(interval);
          // 실제 매칭 모드면 서버가 전달한 미션 유지, 시뮬레이션이면 랜덤 선정
          if (!selectedMission) {
            setSelectedMission(MISSIONS[Math.floor(Math.random() * MISSIONS.length)]);
          }
          setPhase('ready');
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [phase, selectedMission]);

  const handleEnterRoom = () => {
    if (partner && selectedMission) {
      onMatchComplete({
        partner,
        mission: selectedMission,
        isRealMatch: isRealMode,
        roomId: realRoomId,
        isHost
      });
    }
  };

  const formatWaitTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
      {/* 1. 탐색 및 대기 중 (실제 모드: 최대 10분 카운트다운) */}
      {phase === 'searching' && (
        <div className="space-y-6 w-full max-w-md">
          {/* 레이더 그래픽 */}
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full border animate-ping opacity-60 ${
              isRealMode ? 'border-emerald-500/30' : 'border-amber-500/30'
            }`}></div>
            <div className={`absolute inset-4 rounded-full border animate-pulse ${
              isRealMode ? 'border-emerald-500/40' : 'border-amber-500/40'
            }`}></div>
            <div className="w-24 h-24 rounded-full bg-gray-900 border-2 border-emerald-400 flex items-center justify-center shadow-xl">
              <span className="text-4xl">{userProfile.avatar}</span>
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-emerald-400/20 to-transparent animate-spin"></div>
          </div>

          <div>
            {isRealMode ? (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
                  <Users className="w-3.5 h-3.5" />
                  <span>실시간 유저 대기열 참가 중</span>
                </div>
                <h2 className="text-2xl font-black text-white mb-2">
                  실제 파트너를 찾고 있습니다...
                </h2>
                
                {/* 10분 타이머 */}
                <div className="my-3 p-3 rounded-2xl bg-gray-900/90 border border-gray-800 flex items-center justify-center gap-3">
                  <Clock className="w-5 h-5 text-cyan-400 animate-pulse" />
                  <div className="text-left">
                    <div className="text-[10px] text-gray-400">매칭 대기 제한 시간 (최대 10분)</div>
                    <div className="text-xl font-mono font-black text-white">
                      {formatWaitTime(waitSeconds)}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto mb-4">
                  동일한 웹페이지에 다른 사용자가 접속하여 매칭을 누르면 즉시 1:1로 연결됩니다.
                </p>

                {/* 시뮬레이션 즉시 전환 버튼 */}
                <button
                  type="button"
                  onClick={onSwitchToSimulation}
                  className="w-full py-3 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-extrabold flex items-center justify-center gap-1.5 transition shadow-lg shadow-amber-500/10"
                >
                  <Bot className="w-4 h-4" />
                  <span>기다리지 않고 AI 챌린저와 즉시 매칭하기</span>
                </button>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black mb-2 animate-pulse">
                  <Crown className="w-3.5 h-3.5 fill-amber-300" />
                  <span>TOP 0.1% 챌린저 대기열 스캔 중...</span>
                </div>
                <h2 className="text-2xl font-black text-white mb-2">AI 챌린저 랭커 매칭 중</h2>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  누적수익률 +284%를 달성한 전국 최상위 챌린저 봇과 듀오를 결성합니다.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* 2. 매칭 성공 직후 */}
      {phase === 'matched' && partner && (
        <div className="space-y-5 animate-scale-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-black text-xs shadow-lg shadow-emerald-500/20 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{isRealMode ? '🎉 실제 파트너 매칭 성공!' : '👑 챌린저 랭커 매칭 성공!'}</span>
          </div>

          <h2 className="text-3xl font-black text-white tracking-tight">
            듀오 포트폴리오 결성!
          </h2>

          <div className="p-6 rounded-3xl bg-gradient-to-b from-gray-900 via-gray-950 to-[#0B0F19] border-2 border-emerald-500/60 shadow-2xl text-center max-w-sm mx-auto">
            <div className="text-5xl mb-3">{partner.avatar}</div>
            <div className="font-black text-xl text-emerald-300 mb-1">{partner.nickname || partner.name}</div>
            <div className="text-xs text-gray-400 mb-3 font-semibold">
              {isRealMode ? `${partner.style?.label || '투자자'} 성향` : partner.rankTitle}
            </div>

            {/* 앰블럼 (시뮬레이션 모드이거나 앰블럼 보유 시) */}
            {!isRealMode && (
              <div className="flex justify-center mt-2">
                <RankEmblem 
                  tier={partner.tier} 
                  returnRate={partner.returnRate} 
                  winRate={partner.winRate} 
                  size="md" 
                />
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 animate-pulse">
            잠시 후 공동 미션 추첨이 시작됩니다...
          </p>
        </div>
      )}

      {/* 3. 미션 룰렛 */}
      {phase === 'roulette' && (
        <div className="space-y-6 animate-fade-in w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Shuffle className="w-4 h-4 animate-spin" />
            <span>오늘의 미션 추첨 룰렛</span>
          </div>

          <div className="p-6 rounded-3xl bg-gray-900 border-2 border-cyan-500/50 shadow-2xl max-w-md mx-auto">
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

      {/* 4. 최종 확정 (Ready) */}
      {phase === 'ready' && partner && selectedMission && (
        <div className="w-full max-w-md space-y-5 animate-scale-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRealMode ? '2인 실시간 협업 룸 준비 완료!' : '챌린저 듀오 & 미션 확정!'}</span>
          </div>

          {/* 듀오 프로필 카드 */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-gray-900/90 border border-gray-800">
            <div className="p-3 rounded-xl bg-gray-950/80 border border-gray-800 flex flex-col items-center justify-between">
              <span className="text-3xl mb-1">{userProfile.avatar}</span>
              <span className="text-xs font-bold text-white">{userProfile.nickname} (나)</span>
              <span className="text-[10px] text-gray-400 mt-0.5">{userProfile.style.label}</span>
            </div>

            <div className="p-3 rounded-xl bg-gray-950/80 border border-emerald-500/40 flex flex-col items-center justify-between">
              <span className="text-3xl mb-1">{partner.avatar}</span>
              <span className="text-xs font-black text-emerald-300">
                {partner.nickname || partner.name}
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5">
                {isRealMode ? (partner.style?.label || '실제 파트너') : `수익률 ${partner.returnRate}`}
              </span>
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
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-black font-black text-base flex items-center justify-center gap-2 shadow-2xl shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <span>협업 룸 입장 (제한시간 3분 시작)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
