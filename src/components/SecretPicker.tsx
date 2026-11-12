import { useState } from 'react';
import { Eye, EyeOff, Lock, Dices, AlertTriangle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface SecretPickerProps {
  chooserName: string;
  guesserName: string;
  rangeMin: number;
  rangeMax: number;
  onConfirmSecret: (secret: number) => void;
}

export function SecretPicker({
  chooserName,
  guesserName,
  rangeMin,
  rangeMax,
  onConfirmSecret,
}: SecretPickerProps) {
  const [secretInput, setSecretInput] = useState<string>('');
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRandomize = () => {
    sound.playClick();
    const randomVal = Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin;
    setSecretInput(randomVal.toString());
    setErrorMsg(null);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecretInput(e.target.value);
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(secretInput, 10);

    if (isNaN(num)) {
      sound.playWarn();
      setErrorMsg('Please enter or select a valid number.');
      return;
    }

    if (num < rangeMin || num > rangeMax) {
      sound.playWarn();
      setErrorMsg(`Secret number must be between ${rangeMin} and ${rangeMax}.`);
      return;
    }

    sound.playClick();
    onConfirmSecret(num);
  };

  const currentVal = parseInt(secretInput, 10) || rangeMin;

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8 sm:py-12">
      {/* Spy / Privacy Shield Banner */}
      <div className="mb-6 p-4 rounded-3xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/60 flex items-start gap-3.5 shadow-sm">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="text-xs text-amber-950 dark:text-amber-200 space-y-1">
          <div className="font-extrabold text-sm flex items-center gap-1.5">
            <span>Privacy Shield Active</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="leading-relaxed opacity-90">
            Make sure <strong className="underline">{guesserName}</strong> is looking away! Once locked, the number is securely shielded.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {chooserName}, Lock In Secret Number
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pick any integer from <span className="font-bold tabular-nums text-slate-800 dark:text-slate-200">{rangeMin}</span> to <span className="font-bold tabular-nums text-slate-800 dark:text-slate-200">{rangeMax}</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            {/* Number Display Box */}
            <div className="relative flex items-center">
              <input
                type={showSecret ? 'number' : 'password'}
                value={secretInput}
                onChange={(e) => {
                  setSecretInput(e.target.value);
                  setErrorMsg(null);
                }}
                min={rangeMin}
                max={rangeMax}
                required
                autoFocus
                placeholder="Enter Secret Number"
                className="w-full text-center text-4xl sm:text-5xl font-black tracking-widest py-4 px-12 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 tabular-nums transition shadow-inner"
              />

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowSecret(!showSecret);
                }}
                className="absolute right-3.5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition cursor-pointer"
                title={showSecret ? 'Conceal number' : 'Reveal number'}
                aria-label={showSecret ? 'Conceal number' : 'Reveal number'}
              >
                {showSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Tactile Range Slider for picking */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] font-bold text-slate-400 tabular-nums">
                <span>{rangeMin}</span>
                <span className="text-indigo-600 dark:text-indigo-400">Scrubber / Slider</span>
                <span>{rangeMax}</span>
              </div>
              <input
                type="range"
                min={rangeMin}
                max={rangeMax}
                value={currentVal}
                onChange={handleSliderChange}
                className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
              />
            </div>

            {errorMsg && (
              <p className="text-center text-xs font-bold text-rose-500 dark:text-rose-400">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Randomizer Assistant */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={handleRandomize}
              className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700/80"
            >
              <Dices className="w-4 h-4 text-indigo-500" />
              <span>Surprise Me (Pick Random)</span>
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>Lock & Pass to {guesserName}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
