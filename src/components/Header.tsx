import React from 'react';
import { Volume2, VolumeX, Dices, Play, Sparkles } from 'lucide-react';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSimulator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenSimulator,
}) => {
  return (
    <header className="bg-slate-950/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-amber-400 text-lg">
              6/45
            </div>
          </div>
          <div>
            <h1 className="font-black text-slate-100 text-base sm:text-lg tracking-tight flex items-center gap-2">
              로또 번호 생성기
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                PRO
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              대한민국 로또 6/45 자동·조건별·꿈해몽 추천 번호 서비스
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Live Simulator Modal Trigger */}
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>라이브 추첨기</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl text-xs font-bold border transition-all ${
              soundEnabled
                ? 'bg-slate-800 text-amber-400 border-amber-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title={soundEnabled ? '효과음 켜짐' : '효과음 꺼짐'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
