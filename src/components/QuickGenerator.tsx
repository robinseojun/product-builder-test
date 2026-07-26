import React, { useState } from 'react';
import { LottoGame } from '../types';
import { generateMultipleGames, playLottoSound } from '../utils/lotto';
import { LottoPaper } from './LottoPaper';
import { Sparkles, Dices, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface QuickGeneratorProps {
  onSaveSet?: (games: LottoGame[]) => void;
  soundEnabled: boolean;
}

export const QuickGenerator: React.FC<QuickGeneratorProps> = ({ onSaveSet, soundEnabled }) => {
  const [gameCount, setGameCount] = useState<number>(5);
  const [games, setGames] = useState<LottoGame[]>(() => generateMultipleGames(5, 'auto'));
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    if (soundEnabled) playLottoSound('roll');

    setTimeout(() => {
      const newGames = generateMultipleGames(gameCount, 'auto');
      setGames(newGames);
      setIsGenerating(false);
      if (soundEnabled) playLottoSound('pop');
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* Control Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold flex items-center gap-2 text-amber-400">
              <Dices className="w-5 h-5 text-amber-400" />
              빠른 자동 생성
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              원하는 게임 수만큼 완벽한 난수로 6/45 번호를 즉시 추천합니다.
            </p>
          </div>

          {/* Game Count Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60">
            {[1, 2, 3, 4, 5].map((cnt) => (
              <button
                key={cnt}
                onClick={() => {
                  setGameCount(cnt);
                  if (soundEnabled) playLottoSound('pop');
                }}
                className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
                  gameCount === cnt
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                {cnt}게임
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 px-6 rounded-xl font-black text-base bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 hover:brightness-110 active:brightness-95 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? '번호 추출 중...' : `${gameCount}개 게임 번호 즉시 생성하기`}
          </motion.button>
        </div>
      </div>

      {/* Generated Paper Display */}
      {games.length > 0 && (
        <LottoPaper
          games={games}
          title={`빠른 자동 ${games.length}게임 조합`}
          onSave={onSaveSet}
        />
      )}
    </div>
  );
};
