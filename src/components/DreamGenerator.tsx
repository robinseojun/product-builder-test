import React, { useState } from 'react';
import { DREAM_DATABASE, generateDreamGame, playLottoSound } from '../utils/lotto';
import { LottoGame, DreamKeyword } from '../types';
import { LottoPaper } from './LottoPaper';
import { CloudMoon, Sparkles, Wand2, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface DreamGeneratorProps {
  onSaveSet?: (games: LottoGame[]) => void;
  soundEnabled: boolean;
}

export const DreamGenerator: React.FC<DreamGeneratorProps> = ({ onSaveSet, soundEnabled }) => {
  const [inputWord, setInputWord] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState<DreamKeyword | null>(null);
  const [generatedGames, setGeneratedGames] = useState<LottoGame[]>([]);

  const handleDreamGenerate = (keywordText: string) => {
    if (!keywordText.trim()) return;
    if (soundEnabled) playLottoSound('win');

    const labels = ['A', 'B', 'C', 'D', 'E'];
    const games: LottoGame[] = [];

    // Create 5 games variation based on dream keyword
    for (let i = 0; i < 5; i++) {
      const { game } = generateDreamGame(keywordText, labels[i]);
      games.push(game);
    }

    setGeneratedGames(games);
  };

  const handleQuickKeywordClick = (item: DreamKeyword) => {
    setInputWord(item.word);
    setSelectedKeyword(item);
    handleDreamGenerate(item.word);
  };

  return (
    <div className="space-y-6">
      {/* Control Box */}
      <div className="bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 border border-indigo-900/60 rounded-2xl p-5 text-white shadow-xl space-y-5">
        <div>
          <h2 className="text-lg font-extrabold flex items-center gap-2 text-indigo-300">
            <CloudMoon className="w-5 h-5 text-indigo-400" />
            꿈 해몽 & 행운 키워드 생성기
          </h2>
          <p className="text-xs text-indigo-200/70 mt-1">
            꿈에 나타난 단어나 행운의 키워드를 입력하시면 관련 행운 상징 번호를 분석하여 번호를 추출합니다.
          </p>
        </div>

        {/* Input Box */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 dark:text-slate-400" />
            <input
              type="text"
              value={inputWord}
              onChange={(e) => setInputWord(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDreamGenerate(inputWord)}
              placeholder="예: 돼지, 조상님, 바다, 불, 금지게 등 꿈 키워드 입력"
              className="w-full bg-white dark:bg-slate-900/90 border border-indigo-700/60 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={() => handleDreamGenerate(inputWord)}
            disabled={!inputWord.trim()}
            className="px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all flex items-center gap-1.5"
          >
            <Wand2 className="w-4 h-4" />
            추출하기
          </button>
        </div>

        {/* Popular Dream Badges */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-indigo-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            자주 찾는 대표 길몽 키워드:
          </span>

          <div className="flex flex-wrap gap-2">
            {DREAM_DATABASE.map((item) => (
              <button
                key={item.word}
                onClick={() => handleQuickKeywordClick(item)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  inputWord === item.word
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-105'
                    : 'bg-indigo-900/40 text-indigo-200 border-indigo-700/50 hover:bg-indigo-800/60'
                }`}
              >
                {item.word}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Dream Description */}
        {selectedKeyword && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-900/30 border border-indigo-700/40 p-3 rounded-xl text-xs text-indigo-200"
          >
            <span className="font-extrabold text-amber-300">[{selectedKeyword.word}] 꿈의 의미:</span>{' '}
            {selectedKeyword.description} (상징번호: {selectedKeyword.numbers.join(', ')})
          </motion.div>
        )}
      </div>

      {/* Generated Paper */}
      {generatedGames.length > 0 && (
        <LottoPaper
          games={generatedGames}
          title={`[${inputWord || '꿈해몽'}] 행운 분석 5게임`}
          onSave={onSaveSet}
        />
      )}
    </div>
  );
};
