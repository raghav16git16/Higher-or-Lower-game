import { useState, useEffect } from 'react';
import { GameStage, GameSettings, GuessRecord, PlayerStats } from './types';
import { Header } from './components/Header';
import { RulesModal } from './components/RulesModal';
import { GameSetup } from './components/GameSetup';
import { SecretPicker } from './components/SecretPicker';
import { PassHandover } from './components/PassHandover';
import { GuesserArena } from './components/GuesserArena';
import { RoundSummary } from './components/RoundSummary';
import { TournamentChampion } from './components/TournamentChampion';
import { sound } from './utils/audio';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);

  // Sync dark class on documentElement
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Core Game Settings
  const [settings, setSettings] = useState<GameSettings>({
    mode: 'pass_and_play',
    rangeMin: 1,
    rangeMax: 100,
    tournamentRounds: 3,
    soundEnabled: true,
    timerEnabled: true,
    allowMidpointHint: true,
  });

  // Player configurations & Avatars
  const [player1Name, setPlayer1Name] = useState<string>('Player 1');
  const [player2Name, setPlayer2Name] = useState<string>('Player 2');
  const [player1Avatar, setPlayer1Avatar] = useState<string>('🕵️');
  const [player2Avatar, setPlayer2Avatar] = useState<string>('🦊');

  // Active Role Tracking
  // 'P1' | 'P2'
  const [currentChooser, setCurrentChooser] = useState<'P1' | 'P2'>('P1');

  // Match State Machine
  const [stage, setStage] = useState<GameStage>('SETUP');
  const [secretNumber, setSecretNumber] = useState<number>(0);
  const [guesses, setGuesses] = useState<GuessRecord[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(1);

  // Tournament Player Stats
  const [player1Stats, setPlayer1Stats] = useState<PlayerStats>({
    name: 'Player 1',
    avatarIcon: '🕵️',
    avatarColor: 'blue',
    roundsWon: 0,
    totalAttempts: 0,
    bestAttempts: null,
    currentStreak: 0,
  });

  const [player2Stats, setPlayer2Stats] = useState<PlayerStats>({
    name: 'Player 2',
    avatarIcon: '🦊',
    avatarColor: 'amber',
    roundsWon: 0,
    totalAttempts: 0,
    bestAttempts: null,
    currentStreak: 0,
  });


  const chooserName =
    settings.mode === 'single_player'
      ? 'AI Game Master'
      : currentChooser === 'P1'
      ? player1Name
      : player2Name;

  const guesserName =
    settings.mode === 'single_player'
      ? player1Name
      : currentChooser === 'P1'
      ? player2Name
      : player1Name;

  const isComputerGuesser = false;

  // Toggle dark mode
  const handleToggleDarkMode = () => {
    sound.playClick();
    setDarkMode(!darkMode);
  };

  // Toggle sound
  const handleToggleSound = () => {
    const nextMuted = sound.toggleMute();
    setSoundMuted(nextMuted);
  };

  // Start new game from setup
  const handleStartGame = () => {
    // Reset stats
    setPlayer1Stats({
      name: player1Name,
      avatarIcon: player1Avatar,
      avatarColor: 'blue',
      roundsWon: 0,
      totalAttempts: 0,
      bestAttempts: null,
      currentStreak: 0,
    });
    setPlayer2Stats({
      name: settings.mode === 'single_player' ? 'AI Game Master' : player2Name,
      avatarIcon: settings.mode === 'single_player' ? '🤖' : player2Avatar,
      avatarColor: 'amber',
      roundsWon: 0,
      totalAttempts: 0,
      bestAttempts: null,
      currentStreak: 0,
    });
    setCurrentRound(1);
    setCurrentChooser('P1');
    setGuesses([]);


    // Check if Single Player (AI automatically picks random secret number)
    if (settings.mode === 'single_player') {
      const randomSecret =
        Math.floor(Math.random() * (settings.rangeMax - settings.rangeMin + 1)) +
        settings.rangeMin;
      setSecretNumber(randomSecret);
      setStage('GUESSING');
    } else {
      setStage('CHOOSE_SECRET');
    }
  };

  // When Chooser confirms secret number
  const handleConfirmSecret = (num: number) => {
    setSecretNumber(num);
    setGuesses([]);
    // In 2-player pass & play, transition through physical handover screen
    setStage('HANDOVER');
  };

  // When Guesser is ready after device pass
  const handleReadyToGuess = () => {
    setStage('GUESSING');
  };


  // When a guess is submitted
  const handleGuessSubmitted = (record: GuessRecord) => {
    setGuesses((prev) => [...prev, record]);

    if (record.direction === 'CORRECT') {
      // Guesser won the round!
      const totalGuessesForRound = guesses.length + 1;

      if (currentChooser === 'P1') {
        // Player 2 was guesser
        setPlayer2Stats((prev) => ({
          ...prev,
          roundsWon: prev.roundsWon + 1,
          totalAttempts: prev.totalAttempts + totalGuessesForRound,
          bestAttempts:
            prev.bestAttempts === null
              ? totalGuessesForRound
              : Math.min(prev.bestAttempts, totalGuessesForRound),
        }));
      } else {
        // Player 1 was guesser
        setPlayer1Stats((prev) => ({
          ...prev,
          roundsWon: prev.roundsWon + 1,
          totalAttempts: prev.totalAttempts + totalGuessesForRound,
          bestAttempts:
            prev.bestAttempts === null
              ? totalGuessesForRound
              : Math.min(prev.bestAttempts, totalGuessesForRound),
        }));
      }

      setStage('ROUND_OVER');
    }
  };

  // Role Swap & Proceed to Next Round
  const handleSwapRoles = () => {
    if (settings.mode === 'tournament' && currentRound >= settings.tournamentRounds) {
      setStage('TOURNAMENT_OVER');
      return;
    }

    if (settings.mode === 'single_player') {
      const randomSecret =
        Math.floor(Math.random() * (settings.rangeMax - settings.rangeMin + 1)) +
        settings.rangeMin;
      setSecretNumber(randomSecret);
      setGuesses([]);
      setCurrentRound((prev) => prev + 1);
      setStage('GUESSING');
      return;
    }

    const nextChooser = currentChooser === 'P1' ? 'P2' : 'P1';
    setCurrentChooser(nextChooser);
    setCurrentRound((prev) => prev + 1);
    setGuesses([]);
    setStage('CHOOSE_SECRET');
  };

  // Same Roles Rematch (or Next Round in Single Player)
  const handlePlayAgainSameRoles = () => {
    if (settings.mode === 'tournament' && currentRound >= settings.tournamentRounds) {
      setStage('TOURNAMENT_OVER');
      return;
    }

    setCurrentRound((prev) => prev + 1);
    setGuesses([]);

    if (settings.mode === 'single_player') {
      const randomSecret =
        Math.floor(Math.random() * (settings.rangeMax - settings.rangeMin + 1)) +
        settings.rangeMin;
      setSecretNumber(randomSecret);
      setStage('GUESSING');
    } else {
      setStage('CHOOSE_SECRET');
    }
  };


  // Reset entirely to setup screen
  const handleResetGame = () => {
    sound.playClick();
    setStage('SETUP');
    setGuesses([]);
    setCurrentRound(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Header
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        soundMuted={soundMuted}
        onToggleSound={handleToggleSound}
        onOpenRules={() => setIsRulesOpen(true)}
        onResetGame={handleResetGame}
        activeStage={stage}
      />

      <main className="flex-1 flex flex-col items-center justify-center py-6 sm:py-8">
        {stage === 'SETUP' && (
          <GameSetup
            player1Name={player1Name}
            setPlayer1Name={setPlayer1Name}
            player2Name={player2Name}
            setPlayer2Name={setPlayer2Name}
            player1Avatar={player1Avatar}
            setPlayer1Avatar={setPlayer1Avatar}
            player2Avatar={player2Avatar}
            setPlayer2Avatar={setPlayer2Avatar}
            settings={settings}
            setSettings={setSettings}
            onStartGame={handleStartGame}
          />
        )}


        {stage === 'CHOOSE_SECRET' && (
          <SecretPicker
            chooserName={chooserName}
            guesserName={guesserName}
            rangeMin={settings.rangeMin}
            rangeMax={settings.rangeMax}
            onConfirmSecret={handleConfirmSecret}
          />
        )}

        {stage === 'HANDOVER' && (
          <PassHandover
            guesserName={guesserName}
            chooserName={chooserName}
            rangeMin={settings.rangeMin}
            rangeMax={settings.rangeMax}
            onReadyToGuess={handleReadyToGuess}
          />
        )}

        {stage === 'GUESSING' && (
          <GuesserArena
            guesserName={guesserName}
            chooserName={chooserName}
            secretNumber={secretNumber}
            initialMin={settings.rangeMin}
            initialMax={settings.rangeMax}
            settings={settings}
            guesses={guesses}
            onGuessSubmitted={handleGuessSubmitted}
            isComputerGuesser={isComputerGuesser}
          />
        )}

        {stage === 'ROUND_OVER' && (
          <RoundSummary
            winnerName={guesserName}
            loserName={chooserName}
            secretNumber={secretNumber}
            totalAttempts={guesses.length}
            guesses={guesses}
            initialMin={settings.rangeMin}
            initialMax={settings.rangeMax}
            gameMode={settings.mode}
            currentRound={currentRound}
            totalRounds={settings.tournamentRounds}
            onSwapRoles={handleSwapRoles}
            onPlayAgainSameRoles={handlePlayAgainSameRoles}
            onReturnToSetup={handleResetGame}
          />
        )}

        {stage === 'TOURNAMENT_OVER' && (
          <TournamentChampion
            player1={player1Stats}
            player2={player2Stats}
            totalRounds={settings.tournamentRounds}
            onNewTournament={handleResetGame}
          />
        )}
      </main>

      {/* Rules Modal */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

      {/* Subtle Footer with clean unboxed metadata */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center justify-center gap-2">
          <span>Higher or Lower</span>
          <span aria-hidden="true">·</span>
          <span>1 or 2 Players</span>
          <span aria-hidden="true">·</span>
          <span>Directional Clues & Range Shrinker</span>
        </div>

      </footer>
    </div>
  );
}
