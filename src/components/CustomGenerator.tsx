import React, { useState } from 'react';
import { FilterOptions, LottoGame } from '../types';
import { generateFilteredGame, getBallColorClass, playLottoSound } from '../utils/lotto';
import { LottoPaper } from './LottoPaper';
import { SlidersHorizontal, CheckCircle2, XCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface CustomGeneratorProps {
  onSaveSet?: (games: LottoGame[]) => void;
  soundEnabled: boolean;
}

export const CustomGenerator: React.FC<CustomGeneratorProps> = ({ onSaveSet, soundEnabled }) => {
  const [fixedNumbers, setFixedNumbers] = useState<number[]>([]);
  const [excludedNumbers, setExcludedNumbers] = useState<number[]>([]);
  const [oddEvenRatio, setOddEvenRatio] = useState<FilterOptions['oddEvenRatio']>('ALL');
  const [minSum, setMinSum] = useState<number>(100);
  const [maxSum, setMaxSum] = useState<number>(180);
  const [consecutiveLimit, setConsecutiveLimit] = useState<number>(2);

  const [selectMode, setSelectMode] = useState<'fixed' | 'excluded'>('fixed');
  const [gameCount, setGameCount] = useState<number>(5);
  const [generatedGames, setGeneratedGames] = useState<LottoGame[]>([]);

  const handleBallClick = (num: number) => {
    if (soundEnabled) playLottoSound('pop');

    if (selectMode === 'fixed') {
      if (fixedNumbers.includes(num)) {
        setFixedNumbers(fixedNumbers.filter((n) => n !== num));
      } else {
        if (fixedNumbers.length >= 5) {
          alert('고정수는 최대 5개까지 지정할 수 있습니다. (1개는 자동추천)');
          return;
        }
        setExcludedNumbers(excludedNumbers.filter((n) => n !== num));
        setFixedNumbers([...fixedNumbers, num].sort((a, b) => a - b));
      }
    } else {
      if (excludedNumbers.includes(num)) {
        setExcludedNumbers(excludedNumbers.filter((n) => n !== num));
      } else {
        if (45 - excludedNumbers.length - fixedNumbers.length < 6) {
          alert('제외수가 너무 많아 6개 번호를 뽑을 수 없습니다.');
          return;
        }
        setFixedNumbers(fixedNumbers.filter((n) => n !== num));
        setExcludedNumbers([...excludedNumbers, num].sort((a, b) => a - b));
      }
    }
  };

  const handleGenerate = () => {
    if (soundEnabled) playLottoSound('roll');

    const options: FilterOptions = {
      fixedNumbers,
      excludedNumbers,
      oddEvenRatio,
      sumRange: [minSum, maxSum],
      consecutiveLimit,
    };

    const labels = ['A', 'B', 'C', 'D', 'E'];
    const games: LottoGame[] = [];
    for (let i = 0; i < gameCount; i++) {
      games.push(generateFilteredGame(options, labels[i]));
    }

    setGeneratedGames(games);
    if (soundEnabled) playLottoSound('win');
  };

  const handleResetFilters = () => {
    setFixedNumbers([]);
    setExcludedNumbers([]);
    setOddEvenRatio('ALL');
    setMinSum(100);
    setMaxSum(180);
    setConsecutiveLimit(2);
  };

  return (
    <div className="space-y-6">
      {/* Settings Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-extrabold flex items-center gap-2 text-sky-400">
              <SlidersHorizontal className="w-5 h-5 text-sky-400" />
              조건별 추천 생성 (고정수 & 제외수)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              반자동 고정수, 제외수, 홀짝 비율, 번호 합계 범위를 원하는 대로 맞춤 설정하세요.
            </p>
          </div>

          <button
            onClick={handleResetFilters}
            className="text-xs text-slate-400 hover:text-white underline underline-offset-4 flex items-center gap-1 self-start sm:self-auto"
          >
            설정 초기화
          </button>
        </div>

        {/* Mode Selector & Quick Summary */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">선택 모드:</span>
            <button
              onClick={() => setSelectMode('fixed')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all ${
                selectMode === 'fixed'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              고정수 지정 ({fixedNumbers.length}/5)
            </button>
            <button
              onClick={() => setSelectMode('excluded')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all ${
                selectMode === 'excluded'
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              제외수 지정 ({excludedNumbers.length})
            </button>
          </div>

          <div className="text-xs text-slate-400">
            아래 번호판에서 숫자를 클릭하여 {selectMode === 'fixed' ? '고정수' : '제외수'}로 추가하세요.
          </div>
        </div>

        {/* 1 ~ 45 Number Grid Picker */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="grid grid-cols-5 sm:grid-cols-9 md:grid-cols-15 gap-1.5 sm:gap-2">
            {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => {
              const isFixed = fixedNumbers.includes(num);
              const isExcluded = excludedNumbers.includes(num);
              const ballInfo = getBallColorClass(num);

              return (
                <button
                  key={num}
                  onClick={() => handleBallClick(num)}
                  className={`
                    relative h-9 rounded-lg font-extrabold text-xs transition-all flex items-center justify-center border
                    ${
                      isFixed
                        ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400 scale-105 z-10'
                        : isExcluded
                        ? 'bg-rose-950/80 text-rose-400 border-rose-800 line-through opacity-60'
                        : `${ballInfo.bg} text-white border-transparent hover:opacity-90 opacity-80`
                    }
                  `}
                >
                  {isFixed && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-300 border border-slate-900" />}
                  {isExcluded && <span className="absolute top-0.5 right-0.5 text-[9px] text-rose-400">✕</span>}
                  {num}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Summary Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="font-bold text-amber-400 block mb-1.5">📌 포함 고정수 ({fixedNumbers.length}개):</span>
            {fixedNumbers.length === 0 ? (
              <span className="text-slate-500 italic">선택된 고정수 없음 (완전자동)</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {fixedNumbers.map((n) => (
                  <span key={n} className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-extrabold">
                    {n}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <span className="font-bold text-rose-400 block mb-1.5">🚫 제외수 ({excludedNumbers.length}개):</span>
            {excludedNumbers.length === 0 ? (
              <span className="text-slate-500 italic">선택된 제외수 없음</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {excludedNumbers.map((n) => (
                  <span key={n} className="px-2 py-0.5 rounded bg-rose-900/80 text-rose-200 font-bold">
                    {n}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Advanced Filters: Odd/Even, Sum Range, Consecutive */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800 text-xs">
          {/* Odd/Even */}
          <div>
            <label className="font-bold text-slate-300 block mb-1.5">홀짝 비율 필터</label>
            <select
              value={oddEvenRatio}
              onChange={(e) => setOddEvenRatio(e.target.value as FilterOptions['oddEvenRatio'])}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-medium focus:ring-2 focus:ring-sky-500 outline-none"
            >
              <option value="ALL">제한 없음 (전체)</option>
              <option value="3:3">3 : 3 (가장 표준적인 균형)</option>
              <option value="4:2">4 : 2 (홀수 우세)</option>
              <option value="2:4">2 : 4 (짝수 우세)</option>
              <option value="5:1">5 : 1 (홀수 다수)</option>
              <option value="1:5">1 : 5 (짝수 다수)</option>
            </select>
          </div>

          {/* Sum Range */}
          <div>
            <label className="font-bold text-slate-300 block mb-1.5">
              총합 범위 ({minSum} ~ {maxSum})
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="21"
                max="255"
                value={minSum}
                onChange={(e) => setMinSum(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-center font-bold"
              />
              <span className="text-slate-500">~</span>
              <input
                type="number"
                min="21"
                max="255"
                value={maxSum}
                onChange={(e) => setMaxSum(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-center font-bold"
              />
            </div>
          </div>

          {/* Game Count Selector */}
          <div>
            <label className="font-bold text-slate-300 block mb-1.5">생성할 게임 수</label>
            <select
              value={gameCount}
              onChange={(e) => setGameCount(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-medium focus:ring-2 focus:ring-sky-500 outline-none"
            >
              <option value={1}>1 게임</option>
              <option value={2}>2 게임</option>
              <option value={3}>3 게임</option>
              <option value={4}>4 게임</option>
              <option value={5}>5 게임 (1세트)</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleGenerate}
          className="w-full py-3.5 px-6 rounded-xl font-black text-base bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 hover:brightness-110 active:brightness-95 transition-all"
        >
          <RefreshCw className="w-5 h-5" />
          조건 반영 맞춤 번호 생성하기
        </motion.button>
      </div>

      {/* Generated Paper */}
      {generatedGames.length > 0 && (
        <LottoPaper
          games={generatedGames}
          title="조건 맞춤 생성 결과"
          onSave={onSaveSet}
        />
      )}
    </div>
  );
};
