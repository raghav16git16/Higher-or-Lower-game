import { useEffect } from 'react';
import { GuessRecord, GameMode } from '../types';
import { triggerConfetti } from '../utils/confetti';
import { sound } from '../utils/audio';
import { Trophy, RotateCw, RefreshCw, Award, ArrowUp, ArrowDown, CheckCircle2, Sparkles, Star, Zap } from 'lucide-react';

interface RoundSummaryProps {
  winnerName: string;
  loserName: string;
  secretNumber: number;
  totalAttempts: number;
  guesses: GuessRecord[];
  initialMin: number;
  initialMax: number;
  gameMode: GameMode;
  currentRound: number;
  totalRounds: number;
  onSwapRoles: () => void;
  onPlayAgainSameRoles: () => void;
  onReturnToSetup: () => void;
}

export function RoundSummary({
  winnerName,
  loserName,
  secretNumber,
  totalAttempts,
  guesses,
  initialMin,
  initialMax,
  gameMode,
  currentRound,
  totalRounds,
  onSwapRoles,
  onPlayAgainSameRoles,
  onReturnToSetup,
}: RoundSummaryProps) {
  useEffect(() => {
    triggerConfetti();
  }, []);

  const totalRange = initialMax - initialMin + 1;
  const optimalAttempts = Math.ceil(Math.log2(totalRange));

  let rank = 'B';
  let rankColor = 'text-blue-500 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800';
  let performanceTitle = 'Solid Deduction 🎯';
  let performanceDesc = 'Methodical tactical search narrowing down the range.';

  if (totalAttempts <= Math.max(1, optimalAttempts - 1)) {
    rank = 'S+';
    rankColor = 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700';
    performanceTitle = 'Legendary Codebreaker! 🧠';
    performanceDesc = 'Unbelievable intuition! You beat the theoretical binary search benchmark!';
  } else if (totalAttempts <= optimalAttempts) {
    rank = 'S';
    rankColor = 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800';
    performanceTitle = 'Binary Search Master! ⚡';
    performanceDesc = 'Textbook mathematical deduction efficiency.';
  } else if (totalAttempts <= optimalAttempts + 2) {
    rank = 'A';
    rankColor = 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
    performanceTitle = 'Sharp Shooter! 🎯';
    performanceDesc = 'Great guessing precision and swift convergence.';
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      {/* Victory Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center relative overflow-hidden">
        {/* Ambient celebration glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 dark:bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative inline-flex items-center justify-center mb-4">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center ring-8 ring-amber-500/5 shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>
          <div className={`absolute -bottom-1 -right-2 px-2.5 py-1 rounded-xl text-xs font-black border shadow-md ${rankColor}`}>
            RANK {rank}
          </div>
        </div>

        {gameMode === 'tournament' && (
          <div className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-1">
            Tournament Round {currentRound} of {totalRounds}
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          {winnerName} Cracked the Code!
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Successfully uncovered <strong className="text-slate-900 dark:text-white">{loserName}&apos;s</strong> secret number in{' '}
          <strong className="text-indigo-600 dark:text-indigo-400 tabular-nums">
            {totalAttempts} {totalAttempts === 1 ? 'attempt' : 'attempts'}
          </strong>.
        </p>

        {/* Big Secret Number Reveal Card */}
        <div className="my-6 p-6 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-amber-600 text-white shadow-xl shadow-indigo-600/20 max-w-sm mx-auto relative overflow-hidden">
          <div className="text-xs uppercase tracking-widest font-extrabold opacity-85 mb-1 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Secret Number Was</span>
          </div>
          <div className="text-6xl sm:text-7xl font-black tracking-tight tabular-nums py-1 drop-shadow-md">
            {secretNumber}
          </div>
          <div className="text-xs opacity-85 mt-1 font-semibold">
            Search Range: {initialMin} – {initialMax}
          </div>
        </div>

        {/* Efficiency Evaluation Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3.5 text-left">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
            <Zap className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-1">
            <div className="font-extrabold text-sm text-slate-900 dark:text-white">
              {performanceTitle}
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              {performanceDesc} Theoretical optimal binary search benchmark was{' '}
              <strong className="tabular-nums text-slate-800 dark:text-slate-200">{optimalAttempts}</strong> guesses.
            </p>
          </div>
        </div>
      </div>

      {/* Deduction Pathway History */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          The Deduction Path ({guesses.length} Moves)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {guesses.map((g) => (
            <div
              key={g.id}
              className={`p-3 rounded-2xl border text-center transition-all ${
                g.direction === 'CORRECT'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 font-extrabold shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="text-[10px] text-slate-400 font-bold uppercase">
                Move #{g.attemptNumber}
              </div>
              <div className="text-2xl font-black tabular-nums my-1">
                {g.value}
              </div>
              <div className="text-[11px] truncate font-bold">
                {g.direction === 'TOO_LOW' && '⬆️ Higher'}
                {g.direction === 'TOO_HIGH' && '⬇️ Lower'}
                {g.direction === 'CORRECT' && '🎯 Bullseye'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {gameMode === 'single_player' ? (
          <button
            onClick={() => {
              sound.playClick();
              onPlayAgainSameRoles();
            }}
            className="py-4 px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer col-span-1 sm:col-span-2 active:scale-98"
          >
            <RotateCw className="w-5 h-5" />
            <span>Play Again · AI Picks New Random Number</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                sound.playClick();
                onSwapRoles();
              }}
              className="py-4 px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <RotateCw className="w-5 h-5" />
              <span>Swap Roles & Play Next</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onPlayAgainSameRoles();
              }}
              className="py-4 px-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-sm sm:text-base rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Same Roles Rematch</span>
            </button>
          </>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={() => {
            sound.playClick();
            onReturnToSetup();
          }}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
        >
          Change Players, Mode, or Range Bounds
        </button>
      </div>
    </div>
  );
}
