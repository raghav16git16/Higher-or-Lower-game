import { useEffect } from 'react';
import { triggerConfetti } from '../utils/confetti';
import { sound } from '../utils/audio';
import { Trophy, Crown, RotateCcw, Award } from 'lucide-react';
import { PlayerStats } from '../types';

interface TournamentChampionProps {
  player1: PlayerStats;
  player2: PlayerStats;
  totalRounds: number;
  onNewTournament: () => void;
}

export function TournamentChampion({
  player1,
  player2,
  totalRounds,
  onNewTournament,
}: TournamentChampionProps) {
  useEffect(() => {
    triggerConfetti();
    sound.playVictory();
  }, []);

  let championName = player1.name;
  let isTie = false;

  if (player1.roundsWon > player2.roundsWon) {
    championName = player1.name;
  } else if (player2.roundsWon > player1.roundsWon) {
    championName = player2.name;
  } else {
    // Tie-breaker by fewest total attempts
    if (player1.totalAttempts < player2.totalAttempts) {
      championName = player1.name;
    } else if (player2.totalAttempts < player1.totalAttempts) {
      championName = player2.name;
    } else {
      isTie = true;
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-12 text-center space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4 ring-8 ring-amber-500/5">
          <Crown className="w-10 h-10" />
        </div>

        <div className="text-xs uppercase tracking-widest font-extrabold text-amber-600 dark:text-amber-400 mb-2">
          Tournament Series Completed ({totalRounds} Rounds)
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
          {isTie ? 'Epic Grand Stalemate!' : `${championName} is Champion!`}
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8">
          {isTie
            ? 'Both players finished with identical round scores and guess efficiency!'
            : `Crowned undisputed Higher or Lower master after ${totalRounds} tournament rounds.`}

        </p>

        {/* Head-to-Head Comparison */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Player 1 Card */}
          <div
            className={`p-4 rounded-2xl border text-center ${
              championName === player1.name && !isTie
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 ring-2 ring-amber-500'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              {player1.name}
            </div>
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
              {player1.roundsWon}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Rounds Won
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold tabular-nums text-slate-600 dark:text-slate-300">
              {player1.totalAttempts} Total Guesses
            </div>
          </div>

          {/* Player 2 Card */}
          <div
            className={`p-4 rounded-2xl border text-center ${
              championName === player2.name && !isTie
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 ring-2 ring-amber-500'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">
              {player2.name}
            </div>
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
              {player2.roundsWon}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Rounds Won
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold tabular-nums text-slate-600 dark:text-slate-300">
              {player2.totalAttempts} Total Guesses
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onNewTournament();
          }}
          className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Start New Tournament</span>
        </button>
      </div>
    </div>
  );
}
