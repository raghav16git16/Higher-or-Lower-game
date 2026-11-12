import { useState, useEffect, useRef } from 'react';
import { GuessRecord, GameSettings } from '../types';
import { 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  Flame, 
  Snowflake, 
  SunMedium, 
  Clock, 
  Hash, 
  Send,
  Sparkles,
  Delete,
  Target,
  Zap,
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import { sound } from '../utils/audio';
import { VisualNumberRuler } from './VisualNumberRuler';

interface GuesserArenaProps {
  guesserName: string;
  chooserName: string;
  secretNumber: number;
  initialMin: number;
  initialMax: number;
  settings: GameSettings;
  guesses: GuessRecord[];
  onGuessSubmitted: (record: GuessRecord) => void;
  isComputerGuesser?: boolean;
}

export function GuesserArena({
  guesserName,
  chooserName,
  secretNumber,
  initialMin,
  initialMax,
  settings,
  guesses,
  onGuessSubmitted,
  isComputerGuesser = false,
}: GuesserArenaProps) {
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isBotThinking, setIsBotThinking] = useState<boolean>(false);
  const [showNumpad, setShowNumpad] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Compute active narrowed bounds based on past guesses
  const currentMin = guesses.reduce((acc, g) => {
    if (g.direction === 'TOO_LOW') {
      return Math.max(acc, g.value + 1);
    }
    return acc;
  }, initialMin);

  const currentMax = guesses.reduce((acc, g) => {
    if (g.direction === 'TOO_HIGH') {
      return Math.min(acc, g.value - 1);
    }
    return acc;
  }, initialMax);

  const lastGuess = guesses.length > 0 ? guesses[guesses.length - 1] : null;

  // Midpoint calculation for tactical assistance
  const midpoint = Math.floor((currentMin + currentMax) / 2);
  const remainingPossibilities = Math.max(0, currentMax - currentMin + 1);
  const totalOriginal = initialMax - initialMin + 1;
  const eliminatedPercent = Math.min(
    100,
    Math.round(((totalOriginal - remainingPossibilities) / totalOriginal) * 100)
  );

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto focus input
  useEffect(() => {
    if (!isComputerGuesser) {
      inputRef.current?.focus();
    }
  }, [guesses.length, isComputerGuesser]);

  const processGuess = (val: number) => {
    if (val < initialMin || val > initialMax) {
      sound.playWarn();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      setErrorMsg(`Number must be between ${initialMin} and ${initialMax}.`);
      return;
    }

    // Distance calculation
    const diff = Math.abs(val - secretNumber);

    // Audio feedback & comparison with previous distance
    if (lastGuess && lastGuess.distance !== undefined && diff < lastGuess.distance && diff > 0) {
      sound.playWarmer();
    }

    let proximity: GuessRecord['proximity'] = 'cold';
    let proximityText = 'Cold ❄️';

    if (diff === 0) {
      proximity = 'boiling';
      proximityText = 'Bullseye! 🎯';
    } else if (diff <= 3) {
      proximity = 'boiling';
      proximityText = 'Boiling Hot! 🔥';
    } else if (diff <= 8) {
      proximity = 'hot';
      proximityText = 'Very Warm! ♨️';
    } else if (diff <= 15) {
      proximity = 'warm';
      proximityText = 'Warm ☀️';
    } else if (diff <= 25) {
      proximity = 'cool';
      proximityText = 'Cool 🌤️';
    }

    let direction: GuessRecord['direction'] = 'CORRECT';
    let feedbackText = '';

    if (val < secretNumber) {
      direction = 'TOO_LOW';
      feedbackText = 'Higher number please! ⬆️ (Guessed number is lower than secret)';
      sound.playHigherHint();
    } else if (val > secretNumber) {
      direction = 'TOO_HIGH';
      feedbackText = 'Lower number please! ⬇️ (Guessed number is higher than secret)';
      sound.playLowerHint();
    } else {
      direction = 'CORRECT';
      feedbackText = 'Exact match! You cracked the code!';
      sound.playVictory();
    }

    const nextMin = direction === 'TOO_LOW' ? Math.max(currentMin, val + 1) : currentMin;
    const nextMax = direction === 'TOO_HIGH' ? Math.min(currentMax, val - 1) : currentMax;

    const record: GuessRecord = {
      id: `${Date.now()}-${guesses.length + 1}`,
      attemptNumber: guesses.length + 1,
      value: val,
      direction,
      feedbackText,
      proximity,
      proximityText,
      distance: diff,
      timestamp: Date.now(),
      newMin: nextMin,
      newMax: nextMax,
    };

    setInputValue('');
    setErrorMsg(null);
    onGuessSubmitted(record);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) {
      sound.playWarn();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      setErrorMsg('Please enter a valid number.');
      return;
    }
    processGuess(val);
  };

  const handleQuickAdjust = (delta: number) => {
    sound.playClick();
    const current = parseInt(inputValue, 10) || midpoint;
    const next = Math.max(initialMin, Math.min(initialMax, current + delta));
    setInputValue(next.toString());
    inputRef.current?.focus();
  };

  const handleSetMidpoint = () => {
    sound.playClick();
    setInputValue(midpoint.toString());
    inputRef.current?.focus();
  };

  // Numpad key handlers
  const handleNumpadDigit = (digit: string) => {
    sound.playClick();
    if (inputValue.length >= 6) return;
    setInputValue((prev) => prev + digit);
  };

  const handleNumpadBackspace = () => {
    sound.playClick();
    setInputValue((prev) => prev.slice(0, -1));
  };

  const handleNumpadClear = () => {
    sound.playClick();
    setInputValue('');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-6 space-y-5">
      {/* Versus Arena Match Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Active Guesser Info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white font-extrabold flex items-center justify-center text-lg shadow-md shadow-indigo-500/20">
            {guesserName.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Active Decoder
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>{guesserName}</span>
              <span className="text-xs text-slate-400 font-normal">
                vs {chooserName}
              </span>
              {settings.mode === 'single_player' && (
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 px-2 py-0.5 rounded-md">
                  AI Random Secret
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Live Match Metrics */}
        <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 tabular-nums">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTime(elapsedTime)}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50 tabular-nums">
            <Hash className="w-3.5 h-3.5" />
            <span>Guess #{guesses.length + 1}</span>
          </div>
        </div>
      </div>

      {/* Interactive Visual Number Ruler with Eliminated Runway */}
      <VisualNumberRuler
        initialMin={initialMin}
        initialMax={initialMax}
        currentMin={currentMin}
        currentMax={currentMax}
        guesses={guesses}
        onSelectNumber={(val) => {
          setInputValue(val.toString());
          inputRef.current?.focus();
        }}
        midpoint={midpoint}
        lastGuess={lastGuess}
      />

      {/* Dynamic Feedback Power Card */}
      {lastGuess && (
        <div
          className={`relative p-5 sm:p-6 rounded-3xl border shadow-lg transition-all overflow-hidden ${
            lastGuess.direction === 'TOO_LOW'
              ? 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-300 dark:border-amber-800/80 text-amber-950 dark:text-amber-100'
              : lastGuess.direction === 'TOO_HIGH'
              ? 'bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent border-blue-300 dark:border-blue-800/80 text-blue-950 dark:text-blue-100'
              : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
          }`}
        >
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Big Directional Badge */}
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-md transform transition-transform ${
                lastGuess.direction === 'TOO_LOW'
                  ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-white shadow-amber-500/30'
                  : lastGuess.direction === 'TOO_HIGH'
                  ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/30'
                  : 'bg-emerald-500 text-white shadow-emerald-500/30'
              }`}
            >
              {lastGuess.direction === 'TOO_LOW' && <ArrowUp className="w-9 h-9 stroke-[3] animate-bounce" />}
              {lastGuess.direction === 'TOO_HIGH' && <ArrowDown className="w-9 h-9 stroke-[3] animate-bounce" />}
              {lastGuess.direction === 'CORRECT' && <CheckCircle2 className="w-9 h-9 stroke-[3]" />}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase tracking-wider opacity-75">
                <span>Attempt #{lastGuess.attemptNumber}</span>
                <span>·</span>
                <span className="tabular-nums">Guessed {lastGuess.value}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  {lastGuess.proximity === 'boiling' && <Flame className="w-3.5 h-3.5 text-rose-500" />}
                  {lastGuess.proximity === 'hot' && <Flame className="w-3.5 h-3.5 text-amber-500" />}
                  {lastGuess.proximity === 'warm' && <SunMedium className="w-3.5 h-3.5 text-amber-400" />}
                  {lastGuess.proximity === 'cool' && <Snowflake className="w-3.5 h-3.5 text-cyan-400" />}
                  {lastGuess.proximity === 'cold' && <Snowflake className="w-3.5 h-3.5 text-blue-400" />}
                  <span>{lastGuess.proximityText}</span>
                </span>
              </div>

              {/* Exact user requested phrasing */}
              <div className="text-2xl sm:text-3xl font-black tracking-tight">
                {lastGuess.direction === 'TOO_LOW' && 'Higher number please! ⬆️'}
                {lastGuess.direction === 'TOO_HIGH' && 'Lower number please! ⬇️'}
                {lastGuess.direction === 'CORRECT' && 'Exact match! You cracked the code! 🎉'}
              </div>

              <p className="text-xs sm:text-sm font-medium opacity-90 leading-relaxed">
                {lastGuess.direction === 'TOO_LOW' && (
                  <span>
                    The number <strong className="tabular-nums font-bold">{lastGuess.value}</strong> is <u>lower</u> than the secret. Aim higher inside <strong className="tabular-nums font-bold text-amber-700 dark:text-amber-300">{currentMin} – {currentMax}</strong>.
                  </span>
                )}
                {lastGuess.direction === 'TOO_HIGH' && (
                  <span>
                    The number <strong className="tabular-nums font-bold">{lastGuess.value}</strong> is <u>higher</u> than the secret. Aim lower inside <strong className="tabular-nums font-bold text-blue-700 dark:text-blue-300">{currentMin} – {currentMax}</strong>.
                  </span>
                )}
                {lastGuess.direction === 'CORRECT' && (
                  <span>
                    Spot on! The secret number was indeed <strong className="tabular-nums font-bold">{lastGuess.value}</strong>.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Guess Input Station */}
      <div className={`bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl transition-all ${isShaking ? 'animate-shake' : ''}`}>
        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isComputerGuesser ? 'Computer AI Thinking...' : 'Your Next Guess'}
            </span>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowNumpad(!showNumpad);
              }}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>{showNumpad ? 'Hide Keypad' : 'Open On-Screen Keypad'}</span>
            </button>
          </div>

          {/* Big Chunky Input Box */}
          <div className="relative max-w-sm mx-auto">
            <input
              ref={inputRef}
              type="number"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setErrorMsg(null);
              }}
              min={initialMin}
              max={initialMax}
              disabled={isComputerGuesser || isBotThinking}
              placeholder={`${currentMin}–${currentMax}`}
              className="w-full text-center text-4xl sm:text-5xl font-black py-4 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 tabular-nums transition shadow-inner"
            />
          </div>

          {errorMsg && (
            <p className="text-center text-xs font-bold text-rose-500 dark:text-rose-400">
              {errorMsg}
            </p>
          )}

          {/* Stepper Buttons for Quick Increment/Decrement */}
          {!isComputerGuesser && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              {[-10, -5, -1, 1, 5, 10].map((delta) => (
                <button
                  key={delta}
                  type="button"
                  onClick={() => handleQuickAdjust(delta)}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 tabular-nums transition cursor-pointer active:scale-95"
                >
                  {delta > 0 ? `+${delta}` : delta}
                </button>
              ))}
            </div>
          )}

          {/* Binary Search Tactical Helper */}
          {settings.allowMidpointHint && remainingPossibilities > 1 && !isComputerGuesser && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSetMidpoint}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition border border-indigo-200/60 dark:border-indigo-800/60 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Jump to Midpoint: {midpoint} (Cuts range by 50%)</span>
              </button>
            </div>
          )}

          {/* On-Screen Touch Keypad */}
          {showNumpad && !isComputerGuesser && (
            <div className="max-w-xs mx-auto grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleNumpadDigit(digit)}
                  className="h-12 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold text-lg shadow-sm hover:bg-slate-100 dark:hover:bg-slate-600 transition active:scale-95 cursor-pointer tabular-nums"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleNumpadClear}
                className="h-12 rounded-xl bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-slate-300 dark:hover:bg-slate-500 transition active:scale-95 cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleNumpadDigit('0')}
                className="h-12 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold text-lg shadow-sm hover:bg-slate-100 dark:hover:bg-slate-600 transition active:scale-95 cursor-pointer tabular-nums"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleNumpadBackspace}
                className="h-12 rounded-xl bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-500 transition active:scale-95 cursor-pointer"
                title="Backspace"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Primary Submit Button */}
          {!isComputerGuesser && (
            <button
              type="submit"
              disabled={!inputValue}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 disabled:opacity-40 text-white font-bold text-base rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Send className="w-5 h-5" />
              <span>Submit Guess</span>
            </button>
          )}
        </form>
      </div>

      {/* Chronological Guesses History Feed */}
      {guesses.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Deduction Log ({guesses.length} Turns)
            </h3>
            <span className="text-xs text-slate-400">Latest at top</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {[...guesses].reverse().map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs transition hover:bg-slate-100/70 dark:hover:bg-slate-800"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-200/80 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-[11px] tabular-nums">
                    #{g.attemptNumber}
                  </span>
                  <span className="font-black text-lg text-slate-900 dark:text-white tabular-nums">
                    {g.value}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-lg ${
                      g.direction === 'TOO_LOW'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        : g.direction === 'TOO_HIGH'
                        ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                        : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {g.direction === 'TOO_LOW' && <ArrowUp className="w-3 h-3" />}
                    {g.direction === 'TOO_HIGH' && <ArrowDown className="w-3 h-3" />}
                    {g.direction === 'CORRECT' && <CheckCircle2 className="w-3 h-3" />}
                    <span>
                      {g.direction === 'TOO_LOW' ? 'Higher please' : g.direction === 'TOO_HIGH' ? 'Lower please' : 'Match!'}
                    </span>
                  </span>
                </div>

                <div className="text-slate-500 dark:text-slate-400 font-medium tabular-nums flex items-center gap-2">
                  <span>Range: {g.newMin}–{g.newMax}</span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    ({g.proximityText.split(' ')[0]})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
