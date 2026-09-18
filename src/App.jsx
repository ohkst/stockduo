import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Header from './components/Header';
import StepLobby from './components/StepLobby';
import StepMatching from './components/StepMatching';
import StepCollaboration from './components/StepCollaboration';
import StepReport from './components/StepReport';
import ApiKeyModal from './components/ApiKeyModal';
import { BOT_PARTNERS, updateRealTimeStockPrices } from './data/stocks';
import { evaluatePortfolio } from './utils/aiJudge';
import { Loader2, Sparkles } from 'lucide-react';

// 스텝 정의
const STEPS = {
  LOBBY: 'LOBBY',
  MATCHING: 'MATCHING',
  COLLABORATION: 'COLLABORATION',
  EVALUATING: 'EVALUATING',
  REPORT: 'REPORT'
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(STEPS.LOBBY);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('gemini_api_key') || "");

  // Socket.io 인스턴스
  const [socket, setSocket] = useState(null);

  // 사용자 및 세션 상태
  const [userProfile, setUserProfile] = useState({
    nickname: "불나방_개미",
    avatar: "🦁",
    style: { id: "beast", label: "🔥 단타 야수형" },
    mode: 'real' // 'real' | 'simulation'
  });

  const [partner, setPartner] = useState(null);
  const [currentMission, setCurrentMission] = useState(null);
  const [isRealMatch, setIsRealMatch] = useState(false);
  const [roomId, setRealRoomId] = useState(null);

  const [collaboratedStocks, setCollaboratedStocks] = useState([]);
  const [aiReport, setAiReport] = useState(null);

  // 실제 서버 대기열 및 접속자 통계 상태 (진짜 실시간 통계)
  const [queueStats, setQueueStats] = useState({
    waitingCount: 0,
    activeRoomsCount: 0,
    onlineUsersCount: 1
  });

  // 1. Socket.io 및 실시간 시세 초기화
  useEffect(() => {
    // 실시간 주식 시세 백엔드 동기화
    updateRealTimeStockPrices();

    // 초기 통계 REST API 조회
    fetch('/api/stats')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) {
          setQueueStats(json.data);
        }
      })
      .catch(() => {});

    // 웹소켓 연결
    const socketInstance = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5
    });

    socketInstance.on('queue_stats', (stats) => {
      setQueueStats(stats);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // API 키 저장/삭제
  const handleSaveApiKey = (key) => {
    setGeminiApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const handleClearApiKey = () => {
    setGeminiApiKey("");
    localStorage.removeItem('gemini_api_key');
  };

  // 1단계 -> 2단계: 매칭 시작
  const handleStartMatching = (profile) => {
    setUserProfile(profile);
    setIsRealMatch(profile.mode === 'real');
    setCurrentStep(STEPS.MATCHING);
  };

  // 대기 중 AI 시뮬레이션으로 즉시 전환
  const handleSwitchToSimulation = () => {
    if (socket) {
      socket.emit('leave_queue');
    }
    setUserProfile(prev => ({ ...prev, mode: 'simulation' }));
    setIsRealMatch(false);
  };

  // 2단계 -> 3단계: 매칭 완료 및 협업 시작
  const handleMatchComplete = ({ partner: matchedPartner, mission, isRealMatch: realStatus, roomId: matchedRoomId }) => {
    setPartner(matchedPartner);
    setCurrentMission(mission);
    setIsRealMatch(realStatus);
    setRealRoomId(matchedRoomId || null);
    setCurrentStep(STEPS.COLLABORATION);
  };

  // 3단계 -> 4단계: 협업 완료 후 AI 심판관 호출
  const handleCompleteCollaboration = async (basketStocks) => {
    setCollaboratedStocks(basketStocks);
    setCurrentStep(STEPS.EVALUATING);

    try {
      const report = await evaluatePortfolio({
        stocks: basketStocks,
        mission: currentMission,
        userProfile,
        partnerBot: partner || BOT_PARTNERS[0],
        apiKey: geminiApiKey
      });
      setAiReport(report);
      setCurrentStep(STEPS.REPORT);
    } catch (err) {
      console.error("AI Evaluation failed:", err);
      setCurrentStep(STEPS.REPORT);
    }
  };

  // 협업 룸 탈주 및 로비 복귀
  const handleLeaveRoom = () => {
    if (socket && roomId) {
      socket.emit('leave_room', { roomId, userProfile });
    }
    setCollaboratedStocks([]);
    setAiReport(null);
    setPartner(null);
    setRealRoomId(null);
    setIsRealMatch(false);
    setCurrentStep(STEPS.LOBBY);
  };

  // 파트너 탈주 시 AI 챌린저 봇으로 즉시 교체하여 계속 진행
  const handleReplacePartnerWithBot = () => {
    const challengerBot = BOT_PARTNERS[0];
    setPartner(challengerBot);
    setIsRealMatch(false);
    setRealRoomId(null);
  };

  // 리셋 및 새 매칭
  const handleRestart = () => {
    if (socket && roomId) {
      socket.emit('leave_queue');
    }
    setCollaboratedStocks([]);
    setAiReport(null);
    setPartner(null);
    setRealRoomId(null);
    setIsRealMatch(false);
    setCurrentStep(STEPS.LOBBY);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans">
      {/* 상단 네비게이션 (진짜 실시간 대기열 통계 연동) */}
      <Header 
        onOpenApiKeyModal={() => setApiKeyModalOpen(true)} 
        queueStats={queueStats}
      />

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 pb-12">
        {currentStep === STEPS.LOBBY && (
          <StepLobby
            defaultNickname={userProfile.nickname}
            defaultAvatar={userProfile.avatar}
            defaultStyle={userProfile.style.id}
            queueStats={queueStats}
            onStartMatching={handleStartMatching}
          />
        )}

        {currentStep === STEPS.MATCHING && (
          <StepMatching
            userProfile={userProfile}
            socket={socket}
            queueStats={queueStats}
            onMatchComplete={handleMatchComplete}
            onSwitchToSimulation={handleSwitchToSimulation}
          />
        )}

        {currentStep === STEPS.COLLABORATION && partner && currentMission && (
          <StepCollaboration
            userProfile={userProfile}
            partner={partner}
            mission={currentMission}
            isRealMatch={isRealMatch}
            roomId={roomId}
            socket={socket}
            onCompleteCollaboration={handleCompleteCollaboration}
            onLeaveRoom={handleLeaveRoom}
            onReplacePartnerWithBot={handleReplacePartnerWithBot}
          />
        )}

        {/* 4단계: AI 심판관 채점 로딩 화면 */}
        {currentStep === STEPS.EVALUATING && (
          <div className="max-w-md mx-auto px-4 py-24 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-3xl animate-bounce">
                🐕‍🦺
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI 수석 심판관 알파독(AlphaDog)</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">
              듀오 바스켓 종합 심사 중...
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              3종목의 섹터 분산도, 미션 정합성, 기대수익률 및 하방 리스크를 다각도로 분석하고 팩폭 심사평을 작성하고 있습니다.
            </p>
          </div>
        )}

        {currentStep === STEPS.REPORT && aiReport && (
          <StepReport
            userProfile={userProfile}
            partnerBot={partner || BOT_PARTNERS[0]}
            mission={currentMission}
            stocks={collaboratedStocks}
            aiReport={aiReport}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* 푸터 */}
      <footer className="py-4 text-center text-xs text-gray-600 border-t border-gray-900">
        © 2026 StockDuo · Korea Investment & Securities 연계 핀테크 플랫폼
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        apiKey={geminiApiKey}
        onSave={handleSaveApiKey}
        onClear={handleClearApiKey}
      />
    </div>
  );
}
