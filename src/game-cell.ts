export enum CellStatus {
  X = 'X',
  O = 'O',
  EMPTY = '',
}

export class GameCell {
  status: CellStatus;

  constructor() {
    this.status = CellStatus.EMPTY;
  }
}
