import React from 'react';
import { motion } from 'motion/react';
import { getBallColorClass } from '../utils/lotto';

interface LottoBallProps {
  number: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isSelected?: boolean;
  onClick?: () => void;
  animate?: boolean;
  delay?: number;
  highlightMatch?: boolean;
}

export const LottoBall: React.FC<LottoBallProps> = ({
  number,
  size = 'md',
  isSelected = false,
  onClick,
  animate = true,
  delay = 0,
  highlightMatch = false,
}) => {
  const color = getBallColorClass(number);

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs font-bold border',
    md: 'w-10 h-10 text-sm font-black border-2',
    lg: 'w-12 h-12 text-base font-black border-2',
    xl: 'w-16 h-16 text-xl font-black border-2',
  };

  const ballContent = (
    <div
      onClick={onClick}
      className={`
        relative flex items-center justify-center rounded-full select-none transition-all duration-200
        ${sizeClasses[size]}
        ${color.bg} ${color.text} ${color.border}
        shadow-lg ${color.shadow}
        ${onClick ? 'cursor-pointer hover:scale-110 active:scale-95' : ''}
        ${isSelected ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-900 scale-105' : ''}
        ${highlightMatch ? 'ring-4 ring-emerald-400 ring-offset-2 ring-offset-slate-900 animate-pulse' : ''}
      `}
      title={`${number}번 (${color.name})`}
    >
      {/* 3D Gloss / Shine Effect Overlay */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-black/30 pointer-events-none" />
      <div className="absolute top-1 left-1.5 w-1/3 h-1/3 rounded-full bg-white/50 blur-[0.5px] pointer-events-none" />

      {/* Number Display */}
      <span className="relative z-10 drop-shadow-sm font-extrabold tracking-tighter">
        {number}
      </span>
    </div>
  );

  if (!animate) {
    return ballContent;
  }

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 18,
        delay,
      }}
    >
      {ballContent}
    </motion.div>
  );
};
