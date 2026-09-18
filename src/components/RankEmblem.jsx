import React from 'react';
import { Crown, Sparkles, Trophy, Award, Zap } from 'lucide-react';

/**
 * 상대방 수익률 등급 앰블럼 (Challenger, Grandmaster, Master)
 */
export default function RankEmblem({ tier = "CHALLENGER", returnRate = "+284.5%", winRate = "88.4%", size = "md" }) {
  const isChallenger = tier === "CHALLENGER";

  const sizeClasses = {
    sm: "p-1.5 text-xs",
    md: "p-2.5 text-xs",
    lg: "p-4 text-sm"
  };

  return (
    <div className="relative group inline-block">
      {/* 앰블럼 외부 광채 (Aura Glow) */}
      <div className={`absolute -inset-1 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition duration-500 ${
        isChallenger 
          ? 'bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-600 animate-pulse' 
          : 'bg-gradient-to-r from-purple-500 via-pink-400 to-indigo-600'
      }`}></div>

      {/* 앰블럼 본체 */}
      <div className={`relative rounded-2xl border flex items-center gap-2.5 shadow-2xl backdrop-blur-md ${
        isChallenger
          ? 'bg-gradient-to-b from-gray-900 via-amber-950/60 to-gray-950 border-amber-400/80 text-amber-100'
          : 'bg-gradient-to-b from-gray-900 via-purple-950/60 to-gray-950 border-purple-400/80 text-purple-100'
      } ${sizeClasses[size] || sizeClasses.md}`}>
        {/* 심볼 마크 */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg font-black shrink-0 ${
          isChallenger
            ? 'bg-gradient-to-br from-yellow-300 to-amber-600 text-black border border-yellow-200 shadow-yellow-500/40'
            : 'bg-gradient-to-br from-purple-400 to-indigo-600 text-white border border-purple-300 shadow-purple-500/40'
        }`}>
          {isChallenger ? (
            <Crown className="w-5 h-5 fill-black" />
          ) : (
            <Trophy className="w-5 h-5 fill-white" />
          )}
        </div>

        {/* 등급 및 수익률 정보 */}
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-wider uppercase text-[11px] px-1.5 py-0.2 rounded ${
              isChallenger
                ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/40'
                : 'bg-purple-400/20 text-purple-300 border border-purple-400/40'
            }`}>
              {isChallenger ? 'TOP 0.1% CHALLENGER' : 'TOP 0.5% GRANDMASTER'}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-gray-400">누적수익률</span>
            <span className="font-extrabold text-xs text-red-400 tracking-tight">
              {returnRate}
            </span>
            <span className="text-[9px] text-gray-500">|</span>
            <span className="text-[10px] text-gray-400">승률</span>
            <span className="font-bold text-[11px] text-emerald-400">
              {winRate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
