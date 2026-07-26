import React, { useState, useEffect } from 'react';
import { LottoGame } from './types';
import { Header } from './components/Header';
import { QuickGenerator } from './components/QuickGenerator';
import { CustomGenerator } from './components/CustomGenerator';
import { DreamGenerator } from './components/DreamGenerator';
import { SavedGames } from './components/SavedGames';
import { SimulatorModal } from './components/SimulatorModal';
import { ContactModal } from './components/ContactModal';
import { CommentSection } from './components/CommentSection';
import { Dices, SlidersHorizontal, CloudMoon, Bookmark, Sparkles, HelpCircle } from 'lucide-react';
import { playLottoSound } from './utils/lotto';

export default function App() {
  const [activeTab, setActiveTab] = useState<'quick' | 'custom' | 'dream' | 'saved'>('quick');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lotto_theme');
      if (stored === 'light' || stored === 'dark') return stored;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
      return 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('lotto_theme', theme);
  }, [theme]);

  // LocalStorage persistence for saved combinations
  const [savedGames, setSavedGames] = useState<LottoGame[]>(() => {
    try {
      const stored = localStorage.getItem('lotto_saved_games');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('lotto_saved_games', JSON.stringify(savedGames));
    } catch {
      // localStorage error fallback
    }
  }, [savedGames]);

  const handleSaveGames = (newGames: LottoGame[]) => {
    setSavedGames((prev) => {
      const existingIds = new Set(prev.map((g) => g.id));
      const filteredNew = newGames.filter((g) => !existingIds.has(g.id));
      return [...prev, ...filteredNew];
    });
    if (soundEnabled) playLottoSound('win');
  };

  const handleDeleteGame = (id: string) => {
    setSavedGames((prev) => prev.filter((g) => g.id !== id));
  };

  const handleClearAllGames = () => {
    if (window.confirm('저장된 모든 로또 번호를 삭제하시겠습니까?')) {
      setSavedGames([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Sticky Header */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl flex items-center gap-1 shadow-lg overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('quick');
              if (soundEnabled) playLottoSound('pop');
            }}
            className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'quick'
                ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-md scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:bg-slate-800/60'
            }`}
          >
            <Dices className="w-4 h-4" />
            <span>빠른 자동</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('custom');
              if (soundEnabled) playLottoSound('pop');
            }}
            className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'custom'
                ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-md scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:bg-slate-800/60'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>조건별 추천</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('dream');
              if (soundEnabled) playLottoSound('pop');
            }}
            className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'dream'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:bg-slate-800/60'
            }`}
          >
            <CloudMoon className="w-4 h-4" />
            <span>꿈해몽 번호</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('saved');
              if (soundEnabled) playLottoSound('pop');
            }}
            className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap relative ${
              activeTab === 'saved'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:bg-slate-800/60'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>내 저장함</span>
            {savedGames.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-amber-400 text-slate-950 font-black">
                {savedGames.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Contents */}
        <div>
          {activeTab === 'quick' && (
            <QuickGenerator
              onSaveSet={handleSaveGames}
              soundEnabled={soundEnabled}
            />
          )}

          {activeTab === 'custom' && (
            <CustomGenerator
              onSaveSet={handleSaveGames}
              soundEnabled={soundEnabled}
            />
          )}

          {activeTab === 'dream' && (
            <DreamGenerator
              onSaveSet={handleSaveGames}
              soundEnabled={soundEnabled}
            />
          )}

          {activeTab === 'saved' && (
            <SavedGames
              savedGames={savedGames}
              onDeleteGame={handleDeleteGame}
              onClearAll={handleClearAllGames}
            />
          )}
        </div>

        {/* Lotto Ball Color Legend Guide */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-4 text-xs space-y-2">
          <span className="font-extrabold text-slate-600 dark:text-slate-400 block">
            💡 대한민국 로또 6/45 공식 공 색상 표준:
          </span>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500" />
              <span>1 ~ 10번 (노랑)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-blue-600" />
              <span>11 ~ 20번 (파랑)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-600" />
              <span>21 ~ 30번 (빨강)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-600" />
              <span>31 ~ 40번 (회색)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-600" />
              <span>41 ~ 45번 (초록)</span>
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <CommentSection />
      </main>

      {/* Simulator Modal */}
      <SimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onSaveGame={(game) => handleSaveGames([game])}
        soundEnabled={soundEnabled}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 space-y-2">
        <p>© 2026 로또 번호 생성기. 본 서비스의 추천 번호는 확률 및 통계 기반 참고용입니다.</p>
        <button 
          onClick={() => setIsContactOpen(true)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline underline-offset-4"
        >
          제휴 및 문의하기
        </button>
      </footer>
      
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
