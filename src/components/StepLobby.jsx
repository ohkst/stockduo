import React, { useState } from 'react';
import { Dice5, Sparkles, UserCheck, ArrowRight, Bot, Users, Clock, Crown } from 'lucide-react';

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

  const rollRandomNickname = () => {
    const pick = RANDOM_NICKNAMES[Math.floor(Math.random() * RANDOM_NICKNAMES.length)];
    const randomSuffix = Math.floor(Math.random() * 90 + 10);
    setNickname(`${pick}_${randomSuffix}`);
  };

  const handleStartReal = (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    onStartMatching({
      nickname: nickname.trim(),
      avatar,
      style: INVESTMENT_STYLES.find(s => s.id === style) || INVESTMENT_STYLES[0],
      mode: 'real' // 실제 2인 매칭 (최대 10분 대기)
    });
  };

  const handleStartSimulation = (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    onStartMatching({
      nickname: nickname.trim(),
      avatar,
      style: INVESTMENT_STYLES.find(s => s.id === style) || INVESTMENT_STYLES[0],
      mode: 'simulation' // 단독 시뮬레이션 즉시 체험
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      {/* 타이틀 헤더 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>차세대 AI 주식 듀오 플랫폼 : StockDuo</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          익명의 파트너와 함께하는<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            3분 주식 바스켓 듀오 매칭
          </span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          직급도, 자산도 가린 완전 익명 상태에서 3분간 실시간으로 합의하여 미션 포트폴리오를 완성해보세요!
        </p>
      </div>

      {/* 설정 폼 카드 */}
      <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
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

        {/* 진입 버튼 2종류 (실제 매칭 vs AI 시뮬레이션) */}
        <div className="space-y-3 pt-2">
          {/* 1. 실제 유저 실시간 매칭 (정상 진입) */}
          <button
            type="button"
            onClick={handleStartReal}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-black font-black text-base flex items-center justify-between shadow-xl shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all group"
          >
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="font-black text-base leading-tight">실제 유저와 실시간 듀오 매칭</div>
                <div className="text-xs font-semibold text-black/80 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5" /> 최대 10분 대기 · 2인 실시간 동기화
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* 2. AI 챌린저 시뮬레이션 즉시 체험 */}
          <button
            type="button"
            onClick={handleStartSimulation}
            className="w-full py-3.5 px-6 rounded-2xl bg-gray-950 hover:bg-gray-800 border border-amber-500/50 hover:border-amber-400 text-slate-200 text-sm font-bold flex items-center justify-between transition group"
          >
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300">
                <Crown className="w-5 h-5 fill-amber-300" />
              </div>
              <div>
                <div className="font-extrabold text-amber-200">AI 챌린저 시뮬레이션 즉시 체험</div>
                <div className="text-[11px] text-gray-400">대기 없이 상위 0.1% 챌린저 봇과 즉시 1:1 협업</div>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              체험하기 →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
