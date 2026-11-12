import { X, Sparkles, Shield, ArrowUp, ArrowDown, CheckCircle2 } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              How to Play Higher or Lower
            </h2>

          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close rules"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-5 text-sm text-slate-600 dark:text-slate-300 max-h-[75vh] overflow-y-auto">
          {/* Step 1 */}
          <div className="flex gap-3.5">
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center shrink-0 text-xs">
              1
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                Pick or Generate Secret Number
              </h3>
              <p className="leading-relaxed text-slate-500 dark:text-slate-400">
                In <strong>Single Player</strong>, the AI randomly picks the secret number automatically. In <strong>2-Player</strong>, Player 1 chooses a secret number behind an on-screen privacy shield so Player 2 cannot peek!
              </p>
            </div>
          </div>


          {/* Step 2 */}
          <div className="flex gap-3.5">
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center shrink-0 text-xs">
              2
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                Player 2: Guess the Secret Number
              </h3>

              <p className="leading-relaxed text-slate-500 dark:text-slate-400">
                Submit your best guess using the on-screen keypad or numeric input.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-3.5">
            <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center shrink-0 text-xs">
              3
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                Directional Clues & Range Narrowing
              </h3>
              <div className="space-y-2 mt-2">
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs">
                  <ArrowUp className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Lower Guess:</span> If your guess is lower than the actual secret value, the game tells you <em>&quot;Your guess is lower! Higher number please ⬆️&quot;</em>.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-blue-900 dark:text-blue-200 text-xs">
                  <ArrowDown className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Higher Guess:</span> If your guess is higher than the actual secret value, the game tells you <em>&quot;Your guess is higher! Lower number please ⬇️&quot;</em>.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Exact Match:</span> You crack the code, celebrate with confetti fanfare, and can swap roles for the next round!
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pro-Tip */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
            <Shield className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Binary Search Strategy Tip
              </span>
              <p className="text-slate-500 dark:text-slate-400">
                To guess in the fewest attempts, always guess the midpoint of the active range. In a 1–100 range, you can always find any number in 7 or fewer guesses!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
          >
            Got it, Let&apos;s Play!
          </button>
        </div>
      </div>
    </div>
  );
}
