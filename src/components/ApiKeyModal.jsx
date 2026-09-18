import React, { useState } from 'react';
import { Key, Check, ExternalLink, X, ShieldAlert } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, apiKey, onSaveApiKey }) {
  const [inputVal, setInputVal] = useState(apiKey || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(inputVal.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setInputVal('');
    onSaveApiKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#111827] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Google Gemini API 키 설정</h3>
            <p className="text-xs text-gray-400">실시간 맞춤형 AI 알파독 심판관 엔진 연동</p>
          </div>
        </div>

        <div className="mb-4 text-xs text-gray-300 leading-relaxed bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
          <p className="mb-1">
            💡 <strong>API 키 없이도 100% 정상 작동합니다.</strong> 키 미입력 시 내장된 <strong>고도화 AI 시뮬레이션 알고리즘</strong>으로 즉시 판정합니다.
          </p>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-emerald-400 hover:underline mt-1 font-medium"
          >
            Google AI Studio에서 무료 키 발급받기 <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Gemini API Key</label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm focus:outline-none focus:border-emerald-500 text-white placeholder-gray-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleClear}
              type="button"
              className="text-xs text-gray-400 hover:text-red-400 transition"
            >
              키 삭제 / 내장 엔진 사용
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl text-sm transition shadow-lg shadow-emerald-500/20"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" /> 저장 완료!
                </>
              ) : (
                '설정 저장'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
