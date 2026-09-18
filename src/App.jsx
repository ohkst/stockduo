import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ApiKeyModal from './components/ApiKeyModal';
import StepLobby from './components/StepLobby';
import StepMatching from './components/StepMatching';
import StepCollaboration from './components/StepCollaboration';
import StepReport from './components/StepReport';
import { evaluatePortfolio } from './utils/aiJudge';
import { Sparkles, Loader2 } from 'lucide-react';

export default function App() {
  // 상태 머신: 'LOBBY' | 'MATCHING' | 'COLLABORATION' | 'EVALUATING' | 'REPORT'
  const [currentStep, setCurrentStep] = useState('LOBBY');

  // 사용자 정보 및 매칭 정보
  const [userProfile, setUserProfile] = useState({
    nickname: "불나방_개미_42",
    avatar: "🦁",
    style: { id: "beast", label: "🔥 단타 야수형", desc: "수급과 모멘텀 위주 공격적 포지션" }
  });
  const [partnerBot, setPartnerBot] = useState(null);
  const [mission, setMission] = useState(null);
  const [basket, setBasket] = useState([]);
  const [aiReport, setAiReport] = useState(null);

  // Gemini API 키 관리
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('STOCKDUO_GEMINI_KEY') || '';
  });
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const handleSaveApiKey = (key) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('STOCKDUO_GEMINI_KEY', key);
    } else {
      localStorage.removeItem('STOCKDUO_GEMINI_KEY');
    }
  };

  // 1. 로비에서 매칭 시작
  const handleStartMatching = (profile) => {
    setUserProfile(profile);
    setCurrentStep('MATCHING');
  };

  // 2. 매칭 및 미션 룰렛 완료
  const handleMatchComplete = ({ partner, mission }) => {
    setPartnerBot(partner);
    setMission(mission);
    setCurrentStep('COLLABORATION');
  };

  // 3. 3종목 협업 완료 -> AI 심판 평가 시작
  const handleCompleteCollaboration = async (selectedBasket) => {
    setBasket(selectedBasket);
    setCurrentStep('EVALUATING');

    try {
      // 심사 시작 (최소 1.5초 로딩 연출)
      const [report] = await Promise.all([
        evaluatePortfolio({
          stocks: selectedBasket,
          mission,
          userProfile,
          partnerBot,
          apiKey
        }),
        new Promise(res => setTimeout(res, 1800))
      ]);

      setAiReport(report);
      setCurrentStep('REPORT');
    } catch (err) {
      console.error("Evaluation failed:", err);
      alert("AI 평가 중 문제가 발생했습니다. 다시 시도해주세요.");
      setCurrentStep('COLLABORATION');
    }
  };

  // 4. 처음으로 리셋
  const handleRestart = () => {
    setPartnerBot(null);
    setMission(null);
    setBasket([]);
    setAiReport(null);
    setCurrentStep('LOBBY');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans">
      {/* 상단 글로벌 헤더 */}
      <Header
        apiKey={apiKey}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onReset={handleRestart}
      />

      {/* 메인 뷰포트 라우팅 */}
      <main className="flex-1 flex flex-col justify-center">
        {currentStep === 'LOBBY' && (
          <StepLobby
            defaultNickname={userProfile.nickname}
            defaultAvatar={userProfile.avatar}
            defaultStyle={userProfile.style?.id}
            onStartMatching={handleStartMatching}
          />
        )}

        {currentStep === 'MATCHING' && (
          <StepMatching
            userProfile={userProfile}
            onMatchComplete={handleMatchComplete}
          />
        )}

        {currentStep === 'COLLABORATION' && partnerBot && mission && (
          <StepCollaboration
            userProfile={userProfile}
            partnerBot={partnerBot}
            mission={mission}
            onCompleteCollaboration={handleCompleteCollaboration}
          />
        )}

        {/* AI 심판 평가 로딩 화면 */}
        {currentStep === 'EVALUATING' && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
              <div className="absolute inset-3 rounded-full bg-emerald-500/10 flex items-center justify-center text-4xl">
                🐕‍🦺
              </div>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">
              AI 수석 심판관 알파독 심사 중...
            </h2>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              두 익명 투자자의 포트폴리오 케미스트리, 섹터 분산도, 미션 적합도 및 팩폭 심사평을 생성하고 있습니다.
            </p>
          </div>
        )}

        {currentStep === 'REPORT' && aiReport && (
          <StepReport
            userProfile={userProfile}
            partnerBot={partnerBot}
            mission={mission}
            stocks={basket}
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
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />
    </div>
  );
}
