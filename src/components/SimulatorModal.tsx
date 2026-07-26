import React, { useState, useEffect } from 'react';
import { LottoBall } from './LottoBall';
import { generateSingleGame, playLottoSound } from '../utils/lotto';
import { LottoGame } from '../types';
import { Play, RotateCcw, X, Sparkles, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGame?: (game: LottoGame) => void;
  soundEnabled: boolean;
}

export const SimulatorModal: React.FC<SimulatorModalProps> = ({
  isOpen,
  onClose,
  onSaveGame,
  soundEnabled,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnBalls, setDrawnBalls] = useState<number[]>([]);
  const [bonusBall, setBonusBall] = useState<number | null>(null);
  const [targetGame, setTargetGame] = useState<LottoGame | null>(null);

  const startDraw = () => {
    setIsDrawing(true);
    setDrawnBalls([]);
    setBonusBall(null);

    // Generate winning combination
    const game = generateSingleGame('simulated', 'LIVE');
    setTargetGame(game);

    // Generate a bonus number not in the main 6
    let bonus = Math.floor(Math.random() * 45) + 1;
    while (game.numbers.includes(bonus)) {
      bonus = Math.floor(Math.random() * 45) + 1;
    }

    // Step-by-step reveal animation
    game.numbers.forEach((num, index) => {
      setTimeout(() => {
        setDrawnBalls((prev) => [...prev, num]);
        if (soundEnabled) playLottoSound('pop');
      }, (index + 1) * 800);
    });

    // Reveal bonus ball last
    setTimeout(() => {
      setBonusBall(bonus);
      setIsDrawing(false);
      if (soundEnabled) playLottoSound('win');
    }, 7 * 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-base text-amber-400">라이브 로또 추첨기 시뮬레이터</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Machine Dome Stage */}
        <div className="p-6 text-center space-y-6 bg-gradient-to-b from-slate-950 to-slate-900">
          {/* Machine Chamber Visual */}
          <div className="relative w-48 h-48 mx-auto rounded-full border-4 border-amber-500/40 bg-gradient-to-b from-slate-800/40 via-slate-900/80 to-slate-950 shadow-inner flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

            {/* Rotating Bouncing Ball Spheres inside chamber */}
            {isDrawing && (
              <div className="absolute inset-2 animate-spin duration-1000 flex items-center justify-center pointer-events-none opacity-80">
                <div className="w-8 h-8 rounded-full bg-amber-500/80 absolute top-2 left-10 blur-[1px]" />
                <div className="w-8 h-8 rounded-full bg-blue-500/80 absolute bottom-4 right-8 blur-[1px]" />
                <div className="w-8 h-8 rounded-full bg-rose-500/80 absolute top-12 right-2 blur-[1px]" />
                <div className="w-8 h-8 rounded-full bg-emerald-500/80 absolute bottom-2 left-6 blur-[1px]" />
              </div>
            )}

            <div className="z-10 flex flex-col items-center">
              {isDrawing ? (
                <span className="text-xs font-black text-amber-400 tracking-wider animate-pulse">
                  추첨 진행 중...
                </span>
              ) : drawnBalls.length === 6 ? (
                <Trophy className="w-12 h-12 text-amber-400 animate-bounce" />
              ) : (
                <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">
                  [추첨 시작] 버튼을 클릭하세요
                </span>
              )}
            </div>
          </div>

          {/* Tray of Drawn Balls */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 min-h-[90px] flex flex-col items-center justify-center">
            <span className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold mb-2 block">
              추첨된 6개 당첨 번호 + 보너스 번호
            </span>

            <div className="flex items-center justify-center gap-2 flex-wrap">
              {drawnBalls.map((num, idx) => (
                <LottoBall key={`sim-${idx}`} number={num} size="lg" delay={0} />
              ))}

              {/* Bonus Ball */}
              {bonusBall && (
                <>
                  <span className="text-xl font-bold text-amber-400 mx-1">+</span>
                  <div className="flex flex-col items-center">
                    <LottoBall number={bonusBall} size="lg" delay={0} />
                    <span className="text-[10px] text-amber-400 font-bold mt-1">보너스</span>
                  </div>
                </>
              )}

              {drawnBalls.length === 0 && (
                <span className="text-xs text-slate-600">추첨 대기 중...</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={startDraw}
              disabled={isDrawing}
              className="flex-1 py-3 rounded-xl font-black text-sm bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {drawnBalls.length > 0 ? (
                <>
                  <RotateCcw className="w-4 h-4" /> 다시 추첨하기
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> 추첨 시작
                </>
              )}
            </button>

            {targetGame && onSaveGame && drawnBalls.length === 6 && (
              <button
                onClick={() => {
                  onSaveGame(targetGame);
                  onClose();
                }}
                className="px-4 py-3 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-800 text-amber-400 border border-slate-700 hover:bg-slate-700 transition-all"
              >
                추첨 결과 저장
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
