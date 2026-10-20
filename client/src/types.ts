export type Player = 'X' | 'O';
export type Squares = (Player | null)[];
export type Stats = Record<Player, number>;

export interface Players {
  player1: string;
  player2: string;
}

export interface SquareProps {
  value: Player | null;
  label: string;
  onSquareClick: () => void;
}

export interface BoardProps {
  xIsNext: boolean;
  squares: Squares;
  onPlay: (nextSquares: Squares) => void;
  players: Players;
  sessionStats: Stats;
  globalStats: Stats;
}

export interface StartScreenProps {
  onGameStart: (player1: string, player2: string) => void;
}

export interface ScoreBoardProps {
  title: string;
  xScore: number;
  oScore: number;
  color: string;
  textColor?: string;
}

export interface GameGridProps {
  squares: Squares;
  onSquareClick: (i: number) => void;
}

export interface StatsPanelProps {
  sessionStats: Stats;
  globalStats: Stats;
}
