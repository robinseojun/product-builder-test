import React, { useState } from 'react';
import { LottoGame, LottoSet, WinningNumbers } from '../types';
import { RECENT_WINNING_NUMBERS, checkWinningRank, getBallColorClass } from '../utils/lotto';
import { LottoBall } from './LottoBall';
import { LottoPaper } from './LottoPaper';
import { Bookmark, Trophy, Trash2, BarChart2, CheckCircle, Search } from 'lucide-react';

interface SavedGamesProps {
  savedGames: LottoGame[];
  onDeleteGame: (id: string) => void;
  onClearAll: () => void;
}

export const SavedGames: React.FC<SavedGamesProps> = ({
  savedGames,
  onDeleteGame,
  onClearAll,
}) => {
  const [selectedWinningRound, setSelectedWinningRound] = useState<number>(1150);
  const [customNumbersInput, setCustomNumbersInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'list' | 'stats'>('list');

  const selectedWinning = RECENT_WINNING_NUMBERS.find((w) => w.round === selectedWinningRound) || RECENT_WINNING_NUMBERS[0];

  // Frequency Stats Calculation
  const numberFreq: Record<number, number> = {};
  for (let i = 1; i <= 45; i++) numberFreq[i] = 0;

  savedGames.forEach((g) => {
    g.numbers.forEach((n) => {
      numberFreq[n] = (numberFreq[n] || 0) + 1;
    });
  });

  const topNumbers = Object.entries(numberFreq)
    .map(([num, count]) => ({ num: Number(num), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-slate-900 dark:text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold flex items-center gap-2 text-emerald-400">
              <Bookmark className="w-5 h-5 text-emerald-400" />
              내 저장 보관함 ({savedGames.length}개 게임)
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              저장해둔 나만의 로또 조합을 관리하고 당첨 여부를 한눈에 조회하세요.
            </p>
          </div>

          {savedGames.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 self-start sm:self-auto border border-rose-950 px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" /> 전체 비우기
            </button>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              activeTab === 'list'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Trophy className="w-4 h-4" /> 저장목록 & 당첨확인
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              activeTab === 'stats'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BarChart2 className="w-4 h-4" /> 내 보관함 번호 빈도 분석
          </button>
        </div>

        {/* Winning Number Checker Select */}
        {activeTab === 'list' && (
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Trophy className="w-4 h-4 text-amber-400" /> 대조할 당첨 회차 선택:
              </span>

              <select
                value={selectedWinningRound}
                onChange={(e) => setSelectedWinningRound(Number(e.target.value))}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {RECENT_WINNING_NUMBERS.map((w) => (
                  <option key={w.round} value={w.round}>
                    제 {w.round}회 ({w.date})
                  </option>
                ))}
              </select>
            </div>

            {/* Winning Balls Display */}
            <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold mr-1">
                제 {selectedWinning.round}회 당첨번호:
              </span>
              {selectedWinning.numbers.map((num) => (
                <LottoBall key={`win-${num}`} number={num} size="sm" animate={false} />
              ))}
              <span className="text-sm font-bold text-amber-400 mx-1">+</span>
              <LottoBall number={selectedWinning.bonus} size="sm" animate={false} />
              <span className="text-[10px] text-amber-400 font-bold ml-1">(보너스)</span>
            </div>
          </div>
        )}
      </div>

      {/* LIST TAB */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {savedGames.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center text-slate-600 dark:text-slate-400 space-y-3">
              <Bookmark className="w-10 h-10 mx-auto text-slate-600" />
              <p className="font-bold text-sm">저장된 로또 번호가 없습니다.</p>
              <p className="text-xs text-slate-500">
                [빠른 자동 생성]이나 [조건별 생성]에서 번호를 만들어 보관함에 추가해보세요!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {savedGames.map((game, idx) => {
                const rankResult = checkWinningRank(game.numbers, selectedWinning);

                return (
                  <div
                    key={game.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-slate-900 dark:text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-amber-400 font-black text-xs flex items-center justify-center">
                        {game.label || idx + 1}
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {game.numbers.map((n) => {
                          const isMatched = selectedWinning.numbers.includes(n);
                          return (
                            <LottoBall
                              key={`${game.id}-${n}`}
                              number={n}
                              size="md"
                              animate={false}
                              highlightMatch={isMatched}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Result Badge & Delete */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
                      <span
                        className={`text-xs font-extrabold px-3 py-1 rounded-lg border ${
                          rankResult.rank === 1 || rankResult.rank === 2 || rankResult.rank === 3
                            ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md'
                            : rankResult.rank > 0
                            ? 'bg-emerald-900/60 text-emerald-300 border-emerald-700'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-700'
                        }`}
                      >
                        {rankResult.rankText}
                      </span>

                      <button
                        onClick={() => onDeleteGame(game.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* STATS TAB */}
      {activeTab === 'stats' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-slate-900 dark:text-white space-y-4">
          <h3 className="text-sm font-extrabold text-amber-400 flex items-center gap-2">
            <BarChart2 className="w-4 h-4" /> 내 저장함 숫자의 출현 빈도 순위
          </h3>

          {savedGames.length === 0 ? (
            <p className="text-xs text-slate-500">통계를 낼 저장 번호가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {topNumbers.map(({ num, count }) => {
                const colorInfo = getBallColorClass(num);
                return (
                  <div
                    key={num}
                    className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3"
                  >
                    <LottoBall number={num} size="md" animate={false} />
                    <div>
                      <span className="text-xs text-slate-600 dark:text-slate-400 block font-semibold">{num}번</span>
                      <span className="text-sm font-black text-amber-400">{count}회 등장</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
