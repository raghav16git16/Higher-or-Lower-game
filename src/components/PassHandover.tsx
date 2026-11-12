import { Smartphone, ShieldCheck, Play, Lock, EyeOff } from 'lucide-react';
import { sound } from '../utils/audio';

interface PassHandoverProps {
  guesserName: string;
  chooserName: string;
  rangeMin: number;
  rangeMax: number;
  onReadyToGuess: () => void;
}

export function PassHandover({
  guesserName,
  chooserName,
  rangeMin,
  rangeMax,
  onReadyToGuess,
}: PassHandoverProps) {
  const handleProceed = () => {
    sound.playClick();
    onReadyToGuess();
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12 sm:py-16 text-center">
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-indigo-500/5">
          <Smartphone className="w-10 h-10" />
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/50 rounded-full text-xs font-bold mb-4">
          <ShieldCheck className="w-4 h-4" />
          <span>Screen Concealed & Protected</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Pass Device to {guesserName}
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
          <strong className="text-slate-800 dark:text-slate-200">{chooserName}</strong> has locked in their secret number between{' '}
          <strong className="tabular-nums text-indigo-600 dark:text-indigo-400">
            {rangeMin}
          </strong>{' '}
          and{' '}
          <strong className="tabular-nums text-indigo-600 dark:text-indigo-400">
            {rangeMax}
          </strong>
          . Hand the device over so {guesserName} can begin decoding!
        </p>

        <button
          onClick={handleProceed}
          className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>I am {guesserName} · Start Decoding!</span>
        </button>
      </div>
    </div>
  );
}
