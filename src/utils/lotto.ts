import { LottoGame, FilterOptions, DreamKeyword, WinningNumbers } from '../types';

/**
 * Korean Lotto 6/45 Color Rules
 * 1 ~ 10 : Yellow (황색)
 * 11 ~ 20 : Blue (청색)
 * 21 ~ 30 : Red (적색)
 * 31 ~ 40 : Gray (회색)
 * 41 ~ 45 : Green (녹색)
 */
export function getBallColorClass(num: number): {
  bg: string;
  text: string;
  border: string;
  shadow: string;
  gradient: string;
  name: string;
} {
  if (num >= 1 && num <= 10) {
    return {
      bg: 'bg-amber-500',
      text: 'text-amber-950',
      border: 'border-amber-300',
      shadow: 'shadow-amber-500/40',
      gradient: 'from-amber-300 via-amber-400 to-amber-600',
      name: '노랑',
    };
  } else if (num >= 11 && num <= 20) {
    return {
      bg: 'bg-blue-600',
      text: 'text-white',
      border: 'border-blue-400',
      shadow: 'shadow-blue-600/40',
      gradient: 'from-blue-400 via-blue-500 to-blue-700',
      name: '파랑',
    };
  } else if (num >= 21 && num <= 30) {
    return {
      bg: 'bg-rose-600',
      text: 'text-white',
      border: 'border-rose-400',
      shadow: 'shadow-rose-600/40',
      gradient: 'from-rose-400 via-rose-500 to-rose-700',
      name: '빨강',
    };
  } else if (num >= 31 && num <= 40) {
    return {
      bg: 'bg-slate-600',
      text: 'text-white',
      border: 'border-slate-400',
      shadow: 'shadow-slate-600/40',
      gradient: 'from-slate-400 via-slate-500 to-slate-700',
      name: '회색',
    };
  } else {
    return {
      bg: 'bg-emerald-600',
      text: 'text-white',
      border: 'border-emerald-400',
      shadow: 'shadow-emerald-600/40',
      gradient: 'from-emerald-400 via-emerald-500 to-emerald-700',
      name: '초록',
    };
  }
}

// Generate single game of 6 numbers
export function generateSingleGame(type: LottoGame['type'] = 'auto', label = 'A'): LottoGame {
  const numbers: number[] = [];
  while (numbers.length < 6) {
    const rand = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(rand)) {
      numbers.push(rand);
    }
  }
  numbers.sort((a, b) => a - b);

  return {
    id: `game-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    numbers,
    label,
    createdAt: Date.now(),
    type,
  };
}

// Generate multiple games (1-5 games)
export function generateMultipleGames(count: number, type: LottoGame['type'] = 'auto'): LottoGame[] {
  const labels = ['A', 'B', 'C', 'D', 'E'];
  const result: LottoGame[] = [];
  for (let i = 0; i < Math.min(count, 5); i++) {
    result.push(generateSingleGame(type, labels[i]));
  }
  return result;
}

// Generate filtered game with constraints
export function generateFilteredGame(options: FilterOptions, label = 'A'): LottoGame {
  const fixed = [...options.fixedNumbers];
  const excluded = new Set(options.excludedNumbers);

  let attempts = 0;
  const maxAttempts = 1000;

  while (attempts < maxAttempts) {
    attempts++;
    const selected = [...fixed];
    const availablePool = Array.from({ length: 45 }, (_, i) => i + 1).filter(
      (n) => !selected.includes(n) && !excluded.has(n)
    );

    while (selected.length < 6 && availablePool.length > 0) {
      const randomIndex = Math.floor(Math.random() * availablePool.length);
      const chosen = availablePool.splice(randomIndex, 1)[0];
      selected.push(chosen);
    }

    if (selected.length < 6) {
      // Fallback if pool depleted
      break;
    }

    selected.sort((a, b) => a - b);

    // Validate Odd / Even ratio constraint
    const oddCount = selected.filter((n) => n % 2 !== 0).length;
    const evenCount = 6 - oddCount;

    if (options.oddEvenRatio !== 'ALL') {
      const [targetOdd, targetEven] = options.oddEvenRatio.split(':').map(Number);
      if (oddCount !== targetOdd || evenCount !== targetEven) {
        continue;
      }
    }

    // Validate Sum Range
    const sum = selected.reduce((acc, curr) => acc + curr, 0);
    if (sum < options.sumRange[0] || sum > options.sumRange[1]) {
      continue;
    }

    // Validate Consecutive limit
    let maxConsecutive = 1;
    let currentConsecutive = 1;
    for (let i = 1; i < selected.length; i++) {
      if (selected[i] === selected[i - 1] + 1) {
        currentConsecutive++;
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
      } else {
        currentConsecutive = 1;
      }
    }
    if (options.consecutiveLimit > 0 && maxConsecutive > options.consecutiveLimit) {
      continue;
    }

    // All filters passed!
    return {
      id: `filtered-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      numbers: selected,
      label,
      createdAt: Date.now(),
      type: 'custom',
    };
  }

  // Fallback if constraints were too tight
  return generateSingleGame('custom', label);
}

// Popular Korean Dream Keywords Database
export const DREAM_DATABASE: DreamKeyword[] = [
  { word: '돼지', category: '동물', numbers: [3, 8, 12, 17, 25, 34], description: '재물과 풍요를 뜻하는 대표적인 대박 꿈' },
  { word: '조상님', category: '인물', numbers: [1, 10, 14, 21, 33, 40], description: '조상님이 번호를 알려주거나 밝은 모습으로 나타남' },
  { word: '돈 / 현금', category: '재물', numbers: [7, 13, 20, 27, 35, 42], description: '지폐나 수표를 많이 줍거나 받는 꿈' },
  { word: '불 / 화재', category: '자연', numbers: [4, 11, 19, 28, 36, 44], description: '건물이 세게 태워지거나 붉은 화염을 보는 꿈' },
  { word: '물 / 수영', category: '자연', numbers: [2, 9, 16, 24, 32, 41], description: '맑은 바다나 강물에 빠지거나 헤엄치는 꿈' },
  { word: '용 / 여의주', category: '신수', numbers: [5, 15, 23, 30, 38, 45], description: '하늘로 승천하는 용을 보거나 잡는 꿈' },
  { word: '뱀 / 구렁이', category: '동물', numbers: [6, 18, 22, 29, 37, 43], description: '큰 구렁이가 몸을 감싸거나 집으로 들어오는 꿈' },
  { word: '똥 / 대변', category: '재물', numbers: [7, 12, 25, 31, 39, 41], description: '몸에 대변이 묻거나 가득 찬 꿈 (길몽)' },
  { word: '비행기 / 여행', category: '상황', numbers: [8, 14, 26, 32, 36, 40], description: '하늘 높이 비행기를 타고 날아오르는 꿈' },
  { word: '시체 / 상여', category: '상황', numbers: [1, 9, 15, 27, 34, 43], description: '관이나 시체를 보거나 눈물을 흘리는 꿈' },
];

export function generateDreamGame(keyword: string, label = 'A'): { game: LottoGame; matchedInfo?: DreamKeyword } {
  const match = DREAM_DATABASE.find(
    (d) => d.word.includes(keyword.trim()) || keyword.trim().includes(d.word)
  );

  let numbers: number[] = [];
  if (match) {
    // Pick 3-4 numbers from match, fill remaining randomly
    const shuffleMatch = [...match.numbers].sort(() => Math.random() - 0.5);
    numbers = shuffleMatch.slice(0, 4);

    while (numbers.length < 6) {
      const rand = Math.floor(Math.random() * 45) + 1;
      if (!numbers.includes(rand)) {
        numbers.push(rand);
      }
    }
  } else {
    // Seed random from keyword characters
    let seed = 0;
    for (let i = 0; i < keyword.length; i++) {
      seed += keyword.charCodeAt(i);
    }
    while (numbers.length < 6) {
      seed = (seed * 9301 + 49297) % 233280;
      const num = (Math.abs(seed) % 45) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
  }

  numbers.sort((a, b) => a - b);

  return {
    game: {
      id: `dream-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      numbers,
      label,
      createdAt: Date.now(),
      type: 'dream',
    },
    matchedInfo: match,
  };
}

// Sample recent winning numbers for verification
export const RECENT_WINNING_NUMBERS: WinningNumbers[] = [
  { round: 1150, date: '2024-12-14', numbers: [7, 11, 16, 21, 27, 33], bonus: 24 },
  { round: 1149, date: '2024-12-07', numbers: [8, 12, 19, 24, 33, 41], bonus: 4 },
  { round: 1148, date: '2024-11-30', numbers: [3, 8, 17, 24, 29, 35], bonus: 19 },
  { round: 1147, date: '2024-11-23', numbers: [7, 12, 16, 21, 33, 45], bonus: 1 },
  { round: 1146, date: '2024-11-16', numbers: [6, 11, 17, 19, 40, 42], bonus: 28 },
];

export function checkWinningRank(myNumbers: number[], winning: WinningNumbers): {
  matchCount: number;
  hasBonus: boolean;
  rank: 1 | 2 | 3 | 4 | 5 | 0;
  rankText: string;
} {
  const matchCount = myNumbers.filter((n) => winning.numbers.includes(n)).length;
  const hasBonus = myNumbers.includes(winning.bonus);

  if (matchCount === 6) {
    return { matchCount, hasBonus, rank: 1, rankText: '1등 (6개 일치! 대박 축하합니다 🎉)' };
  } else if (matchCount === 5 && hasBonus) {
    return { matchCount, hasBonus, rank: 2, rankText: '2등 (5개 + 보너스 일치! 🥈)' };
  } else if (matchCount === 5) {
    return { matchCount, hasBonus, rank: 3, rankText: '3등 (5개 일치 🥉)' };
  } else if (matchCount === 4) {
    return { matchCount, hasBonus, rank: 4, rankText: '4등 (4개 일치 - 5만원)' };
  } else if (matchCount === 3) {
    return { matchCount, hasBonus, rank: 5, rankText: '5등 (3개 일치 - 5천원)' };
  } else {
    return { matchCount, hasBonus, rank: 0, rankText: '낙첨 (다음 기회에!)' };
  }
}

// Sound synth helper using Web Audio API
export function playLottoSound(type: 'pop' | 'roll' | 'win') {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } else if (type === 'roll') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(320, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } else if (type === 'win') {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = ctx.currentTime + idx * 0.1;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.26);
      });
    }
  } catch (e) {
    // Audio Context blocked or not supported
  }
}
