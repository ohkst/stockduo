import React, { useState } from 'react';
import { Dice5, Sparkles, UserCheck, ShieldCheck, ArrowRight, Bot, Target } from 'lucide-react';

const RANDOM_NICKNAMES = [
  "불나방_개미",
  "여의도_올빼미",
  "판교_단타야수",
  "존버는_승리한다",
  "배당_수집가",
  "차트_망령",
  "복리의_마법사",
  "작전주_사냥꾼"
];

const AVATARS = ["🦁", "🦊", "🐼", "🦅", "🐺", "⚡", "🚀", "💎"];

const INVESTMENT_STYLES = [
  { id: "beast", label: "🔥 단타 야수형", desc: "수급과 모멘텀 위주 공격적 포지션" },
  { id: "value", label: "🛡️ 배당 가치형", desc: "안정적 현금흐름과 저PBR 방어" },
  { id: "trend", label: "⚡ 성장 트렌드형", desc: "AI·신기술 대장주 풀매수" },
  { id: "hedge", label: "🌐 거시경제 헷지형", desc: "고환율·고유가 대비 분산 포트폴리오" }
];

export default function StepLobby({ onStartMatching, defaultNickname, defaultAvatar, defaultStyle }) {
  const [nickname, setNickname] = useState(defaultNickname || "불나방_개미");
  const [avatar, setAvatar] = useState(defaultAvatar || "🦁");
  const [style, setStyle] = useState(defaultStyle || "beast");
  const [atozMode, setAtozMode] = useState(true);

  const rollRandomNickname = () => {
    const pick = RANDOM_NICKNAMES[Math.floor(Math.random() * RANDOM_NICKNAMES.length)];
    const randomSuffix = Math.floor(Math.random() * 90 + 10);
    setNickname(`${pick}_${randomSuffix}`);
  };

  const handleStart = (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    onStartMatching({
      nickname: nickname.trim(),
      avatar,
      style: INVESTMENT_STYLES.find(s => s.id === style) || INVESTMENT_STYLES[0],
      atozMode
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      {/* 타이틀 헤더 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>증권사 AX 혁신 프로젝트 : StockDuo</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          익명의 파트너와 함께하는<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            3분 주식 바스켓 듀오 매칭
          </span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          직급도, 자산도 가린 완전 익명 상태에서 3분간 합의하여 미션 포트폴리오를 완성하고 AI 수석 심판관의 평가를 받아보세요!
        </p>
      </div>

      {/* 설정 카드 */}
      <form onSubmit={handleStart} className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* 아바타 선택 */}
        <div>
          <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
            1. 익명 아바타 선택
          </label>
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
            {AVATARS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setAvatar(emoji)}
                className={`w-12 h-12 text-2xl rounded-2xl flex items-center justify-center transition-all ${
                  avatar === emoji
                    ? 'bg-emerald-500/20 border-2 border-emerald-400 scale-110 shadow-lg shadow-emerald-500/20'
                    : 'bg-gray-800/60 border border-gray-700/60 hover:bg-gray-800 text-gray-400'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* 닉네임 입력 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              2. 익명 닉네임 설정
            </label>
            <button
              type="button"
              onClick={rollRandomNickname}
              className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium transition"
            >
              <Dice5 className="w-3.5 h-3.5" /> 랜덤 생성
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              required
              maxLength={15}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="예: 불나방_개미"
              className="w-full px-4 py-3.5 bg-gray-950 border border-gray-700 rounded-2xl text-white font-medium focus:outline-none focus:border-emerald-500 text-base"
            />
          </div>
        </div>

        {/* 투자 성향 선택 */}
        <div>
          <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
            3. 나의 투자 성향 (매칭 가중치 반영)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {INVESTMENT_STYLES.map((st) => (
              <div
                key={st.id}
                onClick={() => setStyle(st.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  style === st.id
                    ? 'bg-emerald-500/10 border-emerald-500/60 text-white shadow-md'
                    : 'bg-gray-950/60 border-gray-800 hover:border-gray-700 text-gray-300'
                }`}
              >
                <div className="font-bold text-sm mb-0.5">{st.label}</div>
                <div className="text-[11px] text-gray-400 leading-snug">{st.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 심사위원 시연용 AtoZ 봇 모드 안내 */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/30 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-purple-200">심사위원 시연 모드 (AtoZ 시뮬레이션)</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                권장 활성화
              </span>
            </div>
            <p className="text-purple-300/80 leading-relaxed">
              다른 실제 유저 대기 없이도 <strong>스마트 가상 파트너 봇(여의도_차트도사)</strong>이 0.9초 리액션, 역제안 모달, 실시간 상호 합의 등 100% 리얼 협업을 즉시 시뮬레이션합니다.
            </p>
          </div>
        </div>

        {/* 매칭 시작 버튼 */}
        <button
          type="submit"
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-black font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          <span>익명 파트너 탐색 & 미션 룰렛 시작</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
