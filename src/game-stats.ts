export interface IGameStatus {
  wins: { cross: number; nought: number };
  ties: number;
}

export class GameStatus implements IGameStatus {
  wins: { cross: number; nought: number };
  ties: number;

  constructor() {
    this.wins = { cross: 0, nought: 0 };
    this.ties = 0;
  }

  recordWin(winner: 'cross' | 'nought') {
    if (winner === 'cross') {
      this.wins.cross += 1;
    } else {
      this.wins.nought += 1;
    }
  }

  recordTie() {
    this.ties += 1;
  }
}
