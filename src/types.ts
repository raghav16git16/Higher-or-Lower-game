export type GameMode = 'single_player' | 'pass_and_play' | 'tournament';


export type GameStage = 
  | 'SETUP'              // Player names, range, mode
  | 'CHOOSE_SECRET'       // Player 1 picks the secret number
  | 'HANDOVER'           // Privacy cover: Pass device to guesser
  | 'GUESSING'           // Guesser guesses with higher/lower feedback
  | 'ROUND_OVER'         // Correct guess celebration & stats
  | 'TOURNAMENT_OVER';   // Match winner after series

export interface GuessRecord {
  id: string;
  attemptNumber: number;
  value: number;
  direction: 'TOO_LOW' | 'TOO_HIGH' | 'CORRECT';
  feedbackText: string;
  proximity: 'boiling' | 'hot' | 'warm' | 'cool' | 'cold';
  proximityText: string;
  distance: number;
  timestamp: number;
  newMin: number;
  newMax: number;
}

export interface PlayerStats {
  name: string;
  avatarIcon: string;
  avatarColor: string;
  roundsWon: number;
  totalAttempts: number;
  bestAttempts: number | null;
  currentStreak: number;
}


export interface RangeConfig {
  min: number;
  max: number;
  label: string;
}

export interface GameSettings {
  mode: GameMode;
  rangeMin: number;
  rangeMax: number;
  tournamentRounds: number; // e.g. 3 (Best of 3)
  soundEnabled: boolean;
  timerEnabled: boolean;
  allowMidpointHint: boolean;
}
