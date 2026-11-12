import { useState } from 'react';
import { GameMode, GameSettings } from '../types';
import { Users, Trophy, Bot, Play, Hash } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameSetupProps {
  player1Name: string;
  setPlayer1Name: (name: string) => void;
  player2Name: string;
  setPlayer2Name: (name: string) => void;
  player1Avatar: string;
  setPlayer1Avatar: (avatar: string) => void;
  player2Avatar: string;
  setPlayer2Avatar: (avatar: string) => void;
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  onStartGame: () => void;
}

const AVATARS = ['🕵️', '🦊', '🧙‍♂️', '🚀', '🥷', '👾', '🎯', '⚡'];

const PRESET_RANGES = [
  { min: 1, max: 50, label: '1 – 50', desc: 'Fast & Casual (Ideal for beginners)' },
  { min: 1, max: 100, label: '1 – 100', desc: 'Classic Standard (Most popular)' },
  { min: 1, max: 500, label: '1 – 500', desc: 'Tactical (High deduction challenge)' },
  { min: 1, max: 1000, label: '1 – 1,000', desc: 'Grandmaster (10 optimal guesses)' },
];

export function GameSetup({
  player1Name,
  setPlayer1Name,
  player2Name,
  setPlayer2Name,
  player1Avatar,
  setPlayer1Avatar,
  player2Avatar,
  setPlayer2Avatar,
  settings,
  setSettings,
  onStartGame,
}: GameSetupProps) {

  const [selectedPreset, setSelectedPreset] = useState<number | 'custom'>(100);
  const [customMin, setCustomMin] = useState<number>(1);
  const [customMax, setCustomMax] = useState<number>(250);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectPreset = (max: number) => {
    sound.playClick();
    setSelectedPreset(max);
    setSettings((prev) => ({
      ...prev,
      rangeMin: 1,
      rangeMax: max,
    }));
    setErrorMsg(null);
  };

  const handleSelectCustom = () => {
    sound.playClick();
    setSelectedPreset('custom');
    setSettings((prev) => ({
      ...prev,
      rangeMin: customMin,
      rangeMax: customMax,
    }));
  };

  const handleCustomRangeChange = (minVal: number, maxVal: number) => {
    setCustomMin(minVal);
    setCustomMax(maxVal);
    if (minVal >= maxVal) {
      setErrorMsg('Maximum number must be greater than minimum');
    } else {
      setErrorMsg(null);
      setSettings((prev) => ({
        ...prev,
        rangeMin: minVal,
        rangeMax: maxVal,
      }));
    }
  };

  const handleModeChange = (mode: GameMode) => {
    sound.playClick();
    setSettings((prev) => ({ ...prev, mode }));
    if (mode === 'single_player') {
      setPlayer2Name('AI Game Master');
    } else if (player2Name === 'AI Game Master') {
      setPlayer2Name('Player 2');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPreset === 'custom') {
      if (customMin >= customMax) {
        sound.playWarn();
        setErrorMsg('Maximum number must be greater than minimum!');
        return;
      }
      if (customMax - customMin < 5) {
        sound.playWarn();
        setErrorMsg('Range must have at least 5 numbers!');
        return;
      }
    }
    sound.playClick();
    onStartGame();
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Title & Introduction */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/60 rounded-full text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
          <Hash className="w-3.5 h-3.5" />
          <span>Interactive Guessing Arena · 1 or 2 Players</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight text-balance">
          Higher or Lower
        </h1>

        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          Play with a friend or solo against the AI. Receive instant feedback: <span className="font-semibold text-slate-800 dark:text-slate-200">&ldquo;Lower number please&rdquo;</span> or <span className="font-semibold text-slate-800 dark:text-slate-200">&ldquo;Higher number please&rdquo;</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Game Mode Selection */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Select Game Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Mode 1: Single Player (AI Chooser) */}
            <button
              type="button"
              onClick={() => handleModeChange('single_player')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                settings.mode === 'single_player'
                  ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-600 dark:ring-indigo-500'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Bot className={`w-4 h-4 ${settings.mode === 'single_player' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`} />
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Single Player (AI)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                The AI randomly picks the secret number. You guess with directional clues!
              </p>
            </button>

            {/* Mode 2: 2-Player Pass & Play */}
            <button
              type="button"
              onClick={() => handleModeChange('pass_and_play')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                settings.mode === 'pass_and_play'
                  ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-600 dark:ring-indigo-500'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Users className={`w-4 h-4 ${settings.mode === 'pass_and_play' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`} />
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  2-Player Pass & Play
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                Person 1 sets secret with privacy shield; Person 2 guesses on same screen.
              </p>
            </button>

            {/* Mode 3: 2-Player Tournament */}
            <button
              type="button"
              onClick={() => handleModeChange('tournament')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                settings.mode === 'tournament'
                  ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-600 dark:ring-indigo-500'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Trophy className={`w-4 h-4 ${settings.mode === 'tournament' ? 'text-amber-500' : 'text-slate-500'}`} />
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Tournament Series
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                Best of 3 series. Alternate secret chooser each round; fewest guesses wins!
              </p>
            </button>
          </div>
        </div>


        {/* Player Names & Avatars Setup */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {settings.mode === 'single_player' ? 'Player Profile & Character' : 'Players & Characters'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Player 1 Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {settings.mode === 'single_player' ? 'Your Name' : 'Player 1 (Chooser First)'}
                </span>
                <span className="text-xl" title="Current Avatar">{player1Avatar}</span>
              </div>
              <input
                type="text"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                maxLength={20}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="e.g. Alex"
              />
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setPlayer1Avatar(av);
                    }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all cursor-pointer ${
                      player1Avatar === av
                        ? 'bg-indigo-600 text-white shadow-sm scale-110'
                        : 'bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Player 2 or AI Card */}
            {settings.mode === 'single_player' ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                    <span>Opponent (Secret Master)</span>
                    <span className="text-xl">🤖</span>
                  </div>
                  <div className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 mt-1">
                    <Bot className="w-5 h-5 text-emerald-500" />
                    <span>AI Game Master</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Generates a random secret number behind the scenes and guides you with higher/lower clues!
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Player 2 (Guesser First)
                  </span>
                  <span className="text-xl" title="Current Avatar">{player2Avatar}</span>
                </div>
                <input
                  type="text"
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  maxLength={20}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="e.g. Sam"
                />
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setPlayer2Avatar(av);
                      }}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all cursor-pointer ${
                        player2Avatar === av
                          ? 'bg-amber-600 text-white shadow-sm scale-110'
                          : 'bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>



        {/* Range Selection */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Number Range
            </label>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold tabular-nums">
              Active: {settings.rangeMin} – {settings.rangeMax} ({settings.rangeMax - settings.rangeMin + 1} numbers)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
            {PRESET_RANGES.map((preset) => {
              const isSelected = selectedPreset === preset.max;
              return (
                <button
                  key={preset.max}
                  type="button"
                  onClick={() => handleSelectPreset(preset.max)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold ring-1 ring-indigo-600'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-sm font-bold tabular-nums">{preset.label}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {preset.desc.split('(')[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Range Option */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleSelectCustom}
              className={`text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                selectedPreset === 'custom'
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <span className={`w-3 h-3 rounded-full border ${selectedPreset === 'custom' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`} />
              <span>Use Custom Min & Max Bounds</span>
            </button>

            {selectedPreset === 'custom' && (
              <div className="mt-3 grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Minimum Number
                  </label>
                  <input
                    type="number"
                    value={customMin}
                    onChange={(e) => handleCustomRangeChange(parseInt(e.target.value) || 0, customMax)}
                    min={0}
                    max={99999}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Maximum Number
                  </label>
                  <input
                    type="number"
                    value={customMax}
                    onChange={(e) => handleCustomRangeChange(customMin, parseInt(e.target.value) || 0)}
                    min={customMin + 1}
                    max={99999}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {errorMsg && (
              <p className="mt-2 text-xs font-semibold text-rose-500 dark:text-rose-400">
                {errorMsg}
              </p>
            )}
          </div>
        </div>

        {/* Tactical Helper Options */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              Show Midpoint Suggestion
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Assists players with optimal binary search calculation during the game.
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setSettings((prev) => ({
                ...prev,
                allowMidpointHint: !prev.allowMidpointHint,
              }));
            }}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              settings.allowMidpointHint ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
            role="switch"
            aria-checked={settings.allowMidpointHint}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                settings.allowMidpointHint ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Start Game Button */}
        <button
          type="submit"
          className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Start &ldquo;Higher or Lower&rdquo;</span>
        </button>

      </form>
    </div>
  );
}
