import { GuessRecord } from '../types';
import { Flame, Snowflake, SunMedium, Compass, Target } from 'lucide-react';

interface VisualNumberRulerProps {
  initialMin: number;
  initialMax: number;
  currentMin: number;
  currentMax: number;
  guesses: GuessRecord[];
  onSelectNumber?: (val: number) => void;
  midpoint: number;
  lastGuess: GuessRecord | null;
}

export function VisualNumberRuler({
  initialMin,
  initialMax,
  currentMin,
  currentMax,
  guesses,
  onSelectNumber,
  midpoint,
  lastGuess,
}: VisualNumberRulerProps) {
  const totalRange = initialMax - initialMin;

  const getPositionPercent = (val: number) => {
    if (totalRange <= 0) return 50;
    const clamped = Math.max(initialMin, Math.min(initialMax, val));
    return ((clamped - initialMin) / totalRange) * 100;
  };

  const leftEliminatedPercent = getPositionPercent(currentMin);
  const rightActivePercent = getPositionPercent(currentMax);
  const activeWidthPercent = Math.max(0.5, rightActivePercent - leftEliminatedPercent);

  // Temperature gauge score (0 to 100)
  const getProximityScore = () => {
    if (!lastGuess) return 0;
    if (lastGuess.direction === 'CORRECT') return 100;
    const dist = lastGuess.distance ?? 50;
    if (dist <= 3) return 92;
    if (dist <= 8) return 75;
    if (dist <= 15) return 55;
    if (dist <= 25) return 35;
    return 15;
  };

  const proximityScore = getProximityScore();

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Header with Search Radar Status */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Tactical Range Radar
          </span>
        </div>

        {/* Temperature Mercury Gauge */}
        {lastGuess && (
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-slate-400 font-medium">Proximity:</span>
            <div className="w-24 sm:w-28 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex p-0.5">
              <div
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-400 via-amber-400 to-rose-500"
                style={{ width: `${proximityScore}%` }}
              />
            </div>
            <span
              className={`inline-flex items-center gap-1 text-[11px] ${
                proximityScore >= 80
                  ? 'text-rose-500 dark:text-rose-400 font-extrabold'
                  : proximityScore >= 50
                  ? 'text-amber-500 dark:text-amber-400'
                  : 'text-blue-500 dark:text-blue-400'
              }`}
            >
              {proximityScore >= 80 && <Flame className="w-3.5 h-3.5" />}
              {proximityScore >= 50 && proximityScore < 80 && <SunMedium className="w-3.5 h-3.5" />}
              {proximityScore < 50 && <Snowflake className="w-3.5 h-3.5" />}
              <span>{lastGuess.proximityText}</span>
            </span>
          </div>
        )}
      </div>

      {/* The Visual Ruler Track */}
      <div className="pt-8 pb-4 px-2">
        <div className="relative w-full h-7 bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-visible border border-slate-200 dark:border-slate-700/60 shadow-inner">
          {/* Eliminated Left Region */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-slate-200/90 dark:bg-slate-800/90 transition-all duration-300 rounded-l-xl flex items-center justify-start pl-2 overflow-hidden opacity-80"
            style={{ width: `${leftEliminatedPercent}%` }}
          >
            {leftEliminatedPercent > 12 && (
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 whitespace-nowrap">
                Eliminated
              </span>
            )}
          </div>

          {/* Active Search Window Glow */}
          <div
            className="absolute top-0 bottom-0 bg-gradient-to-r from-indigo-500/20 via-indigo-500/30 to-amber-500/20 dark:from-indigo-500/30 dark:via-indigo-500/40 dark:to-amber-500/30 border-y-2 border-indigo-500 dark:border-indigo-400 transition-all duration-300 flex items-center justify-center shadow-lg shadow-indigo-500/10"
            style={{
              left: `${leftEliminatedPercent}%`,
              width: `${activeWidthPercent}%`,
            }}
          >
            {activeWidthPercent > 18 && (
              <span className="text-[10px] font-extrabold tracking-wider text-indigo-700 dark:text-indigo-300 uppercase truncate px-1">
                Active Target Zone
              </span>
            )}
          </div>

          {/* Eliminated Right Region */}
          <div
            className="absolute top-0 bottom-0 right-0 bg-slate-200/90 dark:bg-slate-800/90 transition-all duration-300 rounded-r-xl flex items-center justify-end pr-2 overflow-hidden opacity-80"
            style={{ width: `${100 - rightActivePercent}%` }}
          >
            {100 - rightActivePercent > 12 && (
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 whitespace-nowrap">
                Eliminated
              </span>
            )}
          </div>

          {/* Midpoint Target Beacon */}
          {currentMax - currentMin > 1 && (
            <div
              className="absolute top-[-10px] bottom-[-10px] w-0.5 bg-amber-400 dark:bg-amber-300 z-10 transition-all duration-300 cursor-pointer group"
              style={{ left: `${getPositionPercent(midpoint)}%` }}
              onClick={() => onSelectNumber?.(midpoint)}
              title={`Midpoint: ${midpoint} (Click to guess)`}
            >
              <div className="absolute top-[-18px] left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-amber-500 text-white rounded text-[9px] font-extrabold tabular-nums shadow-sm whitespace-nowrap">
                Mid {midpoint}
              </div>
            </div>
          )}

          {/* Plotted Guess Pins */}
          {guesses.map((g) => {
            const pinPercent = getPositionPercent(g.value);
            const isLatest = lastGuess?.id === g.id;

            return (
              <div
                key={g.id}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 transition-all duration-200 cursor-pointer group"
                style={{ left: `${pinPercent}%` }}
                onClick={() => onSelectNumber?.(g.value)}
              >
                {/* Pin Head */}
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] border-2 shadow-md transition-transform ${
                    isLatest ? 'scale-125 ring-2 ring-white dark:ring-slate-900' : 'group-hover:scale-110'
                  } ${
                    g.direction === 'TOO_LOW'
                      ? 'bg-amber-500 border-amber-300 text-white'
                      : g.direction === 'TOO_HIGH'
                      ? 'bg-blue-600 border-blue-300 text-white'
                      : 'bg-emerald-500 border-emerald-300 text-white'
                  }`}
                >
                  {g.attemptNumber}
                </div>

                {/* Floating Tag */}
                <div
                  className={`absolute bottom-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[10px] font-bold tabular-nums whitespace-nowrap shadow-sm pointer-events-none transition-all ${
                    isLatest
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 group-hover:opacity-100 group-hover:-translate-y-0.5'
                  } ${
                    g.direction === 'TOO_LOW'
                      ? 'bg-amber-600 text-white'
                      : g.direction === 'TOO_HIGH'
                      ? 'bg-blue-700 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {g.value} {g.direction === 'TOO_LOW' ? '⬆️' : g.direction === 'TOO_HIGH' ? '⬇️' : '🎯'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Ruler Boundary Labels */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mt-2.5 tabular-nums">
          <div className="text-left">
            <span className="block text-[10px] text-slate-400 font-medium">Bound</span>
            <span className="text-slate-800 dark:text-slate-200">{initialMin}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block font-normal">Active Min</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{currentMin}</span>
            </div>

            <Target className="w-4 h-4 text-slate-400 shrink-0" />

            <div className="text-center px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block font-normal">Active Max</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{currentMax}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="block text-[10px] text-slate-400 font-medium">Bound</span>
            <span className="text-slate-800 dark:text-slate-200">{initialMax}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
