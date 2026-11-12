import { Volume2, VolumeX, Sun, Moon, HelpCircle, RotateCcw } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  onOpenRules: () => void;
  onResetGame: () => void;
  activeStage: string;
}

export function Header({
  darkMode,
  onToggleDarkMode,
  soundMuted,
  onToggleSound,
  onOpenRules,
  onResetGame,
  activeStage,
}: HeaderProps) {
  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
            ?
          </div>
          <button
            onClick={onResetGame}
            className="text-left group cursor-pointer"
            title="Return to Menu"
          >
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors whitespace-nowrap">
              Higher or Lower
            </span>

            <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              2-Player Edition
            </span>
          </button>
        </div>

        {/* Zone 2: Informational / Navigation */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={onOpenRules}
            className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Rules & Strategies</span>
          </button>
          {activeStage !== 'SETUP' && (
            <button
              onClick={onResetGame}
              className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>New Game</span>
            </button>
          )}
        </div>

        {/* Zone 3: Interactive Utilities */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenRules}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="How to play"
            aria-label="How to play"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleSound}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title={soundMuted ? 'Unmute sounds' : 'Mute sounds'}
            aria-label={soundMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {soundMuted ? (
              <VolumeX className="w-5 h-5 text-rose-500" />
            ) : (
              <Volume2 className="w-5 h-5 text-emerald-500" />
            )}
          </button>

          <button
            onClick={onToggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>

          {activeStage !== 'SETUP' && (
            <button
              onClick={onResetGame}
              className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Restart
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
