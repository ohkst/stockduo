import React, { useState, useEffect } from 'react';
import { Zap, ShieldCheck, Key, Users } from 'lucide-react';

export default function Header({ onOpenApiKeyModal, apiKey, onReset, queueStats = { waitingCount: 0, onlineUsersCount: 1 } }) {
  const waitingCount = queueStats.waitingCount || 0;
  const onlineCount = queueStats.onlineUsersCount || 1;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800/80 bg-[#0B0F19]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 서비스 로고 */}
        <div 
          onClick={onReset} 
          className="flex items-center gap-2.5 cursor-pointer group transition select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-black fill-black" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                StockDuo
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                AI 주식 바스켓
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium hidden sm:block">
              위계 없는 3분 익명 주식 협업 플랫폼
            </p>
          </div>
        </div>

        {/* 우측 배지 및 옵션 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 진짜 실시간 매칭 대기자 수 & 접속자 수 */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900/90 border border-gray-800 text-xs text-gray-300 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${waitingCount > 0 ? 'bg-emerald-400' : 'bg-cyan-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${waitingCount > 0 ? 'bg-emerald-500' : 'bg-cyan-500'}`}></span>
            </span>
            <Users className="w-3.5 h-3.5 text-gray-400" />
            <div className="flex items-center gap-1">
              <span className="text-gray-400 text-[11px]">실시간 대기:</span>
              <span className={`font-black ${waitingCount > 0 ? 'text-emerald-400 font-bold' : 'text-gray-300'}`}>
                {waitingCount}명
              </span>
            </div>
            <span className="text-gray-600 text-[10px] hidden sm:inline">|</span>
            <span className="text-gray-400 text-[11px] hidden sm:inline">
              접속 <strong className="text-cyan-300">{onlineCount}</strong>명
            </span>
          </div>

          {/* Gemini API 설정 버튼 */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
              apiKey
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
                : 'bg-gray-800/80 border-gray-700 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-yellow-400" />
            <span className="hidden sm:inline">{apiKey ? 'Gemini AI 연동됨' : 'AI 엔진 설정'}</span>
            <span className="sm:hidden">AI</span>
          </button>
        </div>
      </div>
    </header>
  );
}
