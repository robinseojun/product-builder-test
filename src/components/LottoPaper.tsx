import React, { useState } from 'react';
import { LottoGame } from '../types';
import { LottoBall } from './LottoBall';
import { Copy, Check, Bookmark, BookmarkCheck, Trash2, Sparkles, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LottoPaperProps {
  games: LottoGame[];
  title?: string;
  onSave?: (games: LottoGame[]) => void;
  onDelete?: (id: string) => void;
  isSaved?: boolean;
}

export const LottoPaper: React.FC<LottoPaperProps> = ({
  games,
  title = '로또 6/45 추천 조합',
  onSave,
  onDelete,
  isSaved = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [savedLocal, setSavedLocal] = useState(isSaved);

  const handleCopy = () => {
    const text = games
      .map((g) => `[${g.label}] ${g.numbers.join(', ')}`)
      .join('\n');
    navigator.clipboard.writeText(`[로또 6/45 추천 번호]\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToggle = () => {
    if (onSave) {
      onSave(games);
      setSavedLocal(true);
    }
  };

  return (
    <div className="bg-gradient-to-b from-amber-50 to-orange-50/80 border border-amber-200/80 rounded-2xl shadow-xl p-4 sm:p-6 text-slate-800 relative overflow-hidden">
      {/* Decorative Slip Header Design */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500" />

      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-amber-200/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded font-black bg-red-600 text-white tracking-wider">
              제 6/45 회
            </span>
            <h3 className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
              {title}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            생성일시: {new Date().toLocaleDateString('ko-KR')} {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onSave && (
            <button
              onClick={handleSaveToggle}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                savedLocal
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
            >
              {savedLocal ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  저장됨
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  번호 저장
                </>
              )}
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-all"
            title="텍스트 복사"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                복사완료
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                복사
              </>
            )}
          </button>
        </div>
      </div>

      {/* Games List */}
      <div className="space-y-3">
        <AnimatePresence>
          {games.map((game, index) => {
            const sum = game.numbers.reduce((a, b) => a + b, 0);
            const odds = game.numbers.filter((n) => n % 2 !== 0).length;
            const evens = 6 - odds;

            return (
              <motion.div
                key={game.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="bg-white/90 border border-amber-200/90 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Game Label & Type */}
                <div className="flex items-center gap-2 min-w-[90px]">
                  <span className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 text-amber-400 font-black flex items-center justify-center text-sm shadow">
                    {game.label || String.fromCharCode(65 + index)}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">
                      {game.type === 'auto'
                        ? '자동'
                        : game.type === 'custom'
                        ? '조건지정'
                        : game.type === 'dream'
                        ? '꿈해몽'
                        : '추첨'}
                    </span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">6/45</span>
                  </div>
                </div>

                {/* Lotto Balls */}
                <div className="flex items-center gap-1.5 sm:gap-2 justify-center flex-wrap my-1 sm:my-0">
                  {game.numbers.map((num, idx) => (
                    <LottoBall
                      key={`${game.id}-${num}-${idx}`}
                      number={num}
                      size="md"
                      delay={idx * 0.04 + index * 0.08}
                    />
                  ))}
                </div>

                {/* Game Quick Stats */}
                <div className="flex items-center justify-between sm:justify-end gap-3 text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <span>
                      합계: <strong className="text-slate-800 font-semibold">{sum}</strong>
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">|</span>
                    <span>
                      홀:짝{' '}
                      <strong className="text-slate-800 font-semibold">
                        {odds}:{evens}
                      </strong>
                    </span>
                  </div>

                  {onDelete && (
                    <button
                      onClick={() => onDelete(game.id)}
                      className="text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-800/80">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          건전한 복권 문화! 행운을 빕니다.
        </span>
        <span>총 {games.length}개 게임 (5,000원 상당)</span>
      </div>
    </div>
  );
};
