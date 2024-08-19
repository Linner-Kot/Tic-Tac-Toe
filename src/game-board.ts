import { GameCell, CellStatus } from './game-cell';

export interface IGameBoard {
  cells: GameCell[][];
  markCell(row: number, col: number, status: CellStatus): boolean;
  isBoardFull(): boolean;
}

export class GameBoard implements IGameBoard {
  cells: GameCell[][];

  constructor(size: number = 3) {
    this.cells = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => new GameCell()),
    );
  }

  markCell(row: number, col: number, status: CellStatus): boolean {
    if (this.cells[row][col].status === CellStatus.EMPTY) {
      this.cells[row][col].status = status;
      return true;
    }
    return false;
  }

  isBoardFull(): boolean {
    return this.cells.every((row) =>
      row.every((cell) => cell.status !== CellStatus.EMPTY),
    );
  }
}
