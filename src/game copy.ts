import { CellStatus } from './game-cell';
import { MAX_BOARD_SIZE, MIN_BOARD_SIZE, Settings } from './settings';

export class Game {
  private board: CellStatus[][] = [];
  private currentPlayer: CellStatus = CellStatus.EMPTY;
  private size: number;

  constructor(size = 3) {
    if (size < MIN_BOARD_SIZE) {
      this.size = MIN_BOARD_SIZE;
      console.log(`Минимальный размер поля ${MIN_BOARD_SIZE}`);
    } else if (size > 20) {
      this.size = MAX_BOARD_SIZE;
      console.log(`Максимальный размер поля ${MAX_BOARD_SIZE}`);
    } else {
      this.size = size;
    }
    this.reset();
  }

  getCurrentPlayer(): CellStatus {
    return this.currentPlayer;
  }

  getSize(): number {
    return this.size;
  }

  public reset() {
    this.currentPlayer = CellStatus.X;
    this.board = Array.from({ length: this.size }, () =>
      Array.from({ length: this.size }, () => CellStatus.EMPTY),
    );
  }

  public printBoard() {
    console.log(
      this.board
        .map((row) => row.map((cell) => cell || ' ').join('|'))
        .join('\n'),
      '\n',
    );
  }

  public makeMove(row: number, column: number): boolean {
    if (row < 0 || row >= this.size || column < 0 || column >= this.size) {
      console.log('{Ход выходит за пределы доски}');
      // throw new Error('Ход выходит за пределы доски')
      return false;
    }
    if (this.board[row][column]) {
      console.log('Ячейка уже занята');
      // throw new Error('Ячейка уже занята')
      return false;
    }
    this.board[row][column] = this.currentPlayer;
    this.printBoard();
    if (this.checkWinner()) {
      console.log(`Игрок ${this.currentPlayer} победил!`);
      return true;
    }
    this.currentPlayer =
      this.currentPlayer === CellStatus.X ? CellStatus.O : CellStatus.X;
    return false;
  }

  /** Check for winner */
  private checkWinner(): boolean {
    return (
      this.checkHorizontal() ||
      this.checkVertical() ||
      this.checkMainDiagonal() ||
      this.checkSecondDiagonal()
    );
  }

  /** Check line */
  private checkLine(line: CellStatus[]): boolean {
    return line.every((cell) => cell !== CellStatus.EMPTY && cell === line[0]);
  }

  /** Check horizontal */
  private checkHorizontal(): boolean {
    for (let index = 0; index < this.size; index++) {
      if (this.checkLine(this.board[index])) {
        return true;
      }
    }
    return false;
  }

  /** Check vertical */
  private checkVertical(): boolean {
    for (let index = 0; index < this.size; index++) {
      const columns: CellStatus[] = this.board.map((row) => row[index]);
      if (this.checkLine(columns)) {
        return true;
      }
    }
    return false;
  }

  /** Check main diagonal */
  private checkMainDiagonal(): boolean {
    const mainDiagonal: CellStatus[] = [];
    for (let index = 0; index < this.size; index++) {
      mainDiagonal.push(this.board[index][index]);
    }
    return this.checkLine(mainDiagonal);
  }

  /** Check second diagonal */
  private checkSecondDiagonal(): boolean {
    const secondDiagonal: CellStatus[] = [];
    for (let index = 0; index < this.size; index++) {
      secondDiagonal.push(this.board[index][this.size - index - 1]);
    }
    return this.checkLine(secondDiagonal);
  }

  public fillBoardTemplate() {
    const boardTemplate =
      (document.querySelector(
        Settings.SELECTOR_BOARD_CONTAINER,
      ) as HTMLElement) || null;
    if (boardTemplate) {
      const fragment = document.createDocumentFragment();

      // Установка CSS Grid шаблона для строк и колонок
      boardTemplate.style.display = 'grid';
      boardTemplate.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;
      boardTemplate.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;

      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          fragment.append(this.createCellTemplate(row, col));
        }
      }
      boardTemplate.append(fragment);
      boardTemplate.addEventListener('click', (event_) => {
        event_.preventDefault();
        const target = event_.target as HTMLElement;
        const row = target.dataset.x!;
        const column = target.dataset.y!;
        target.textContent = this.currentPlayer;
        this.makeMove(+row, +column);
      });
    }
  }

  private createCellTemplate(row: number, col: number): HTMLElement {
    const cellTemplate = document.createElement('div');
    cellTemplate.classList.add('cell');
    cellTemplate.dataset.x = row.toString();
    cellTemplate.dataset.y = col.toString();
    return cellTemplate;
  }
}

// test game
// const game = new Game(3);
// game.makeMove(0, 0); // X
// game.makeMove(0, 1); // O
// game.makeMove(1, 0); // X
// game.makeMove(0, 2); // O
// game.makeMove(2, 0); // X
// game.reset();
