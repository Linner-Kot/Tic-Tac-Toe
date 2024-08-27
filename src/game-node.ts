import readline from 'node:readline';
import { CellStatus } from './game-cell';
import { Settings } from './settings';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export class GameNode {
  private boardStatus: CellStatus[][] = [];
  private currentPlayer: CellStatus = CellStatus.EMPTY;
  private boardSize: number;

  constructor(boardSize: number) {
    if (boardSize < Settings.MIN_BOARD_SIZE) {
      this.boardSize = Settings.MIN_BOARD_SIZE;
      console.log(`Минимальный размер поля ${Settings.MIN_BOARD_SIZE}`);
    } else if (boardSize > Settings.MAX_BOARD_SIZE) {
      this.boardSize = Settings.MAX_BOARD_SIZE;
      console.log(`Максимальный размер поля ${Settings.MAX_BOARD_SIZE}`);
    } else {
      this.boardSize = boardSize;
    }

    this.reset();
    this.printBoard();
    this.askMove();
  }

  private reset() {
    this.currentPlayer = CellStatus.X;
    this.boardStatus = Array.from({ length: this.boardSize }, () =>
      Array.from({ length: this.boardSize }, () => CellStatus.EMPTY),
    );
  }

  public printBoard() {
    console.log(
      this.boardStatus
        .map((row) => row.map((cell) => cell || ' ').join('|'))
        .join('\n'),
      '\n',
    );
  }

  public askMove() {
    rl.question(
      `Игрок ${this.currentPlayer}, введите ваш ход (row,col): `,
      (answer) => {
        const [row, col] = answer.split(',').map(Number);
        if (!Number.isInteger(row) || !Number.isInteger(col)) {
          console.log('Убедитесь, что ввели координаты в формате row,col.');
          this.askMove();
          return;
        }
        if (this.makeMove(row, col)) {
          rl.close();
        } else {
          this.askMove();
        }
      },
    );
  }

  public makeMove(row: number, column: number): boolean {
    if (
      row < 0 ||
      row >= this.boardSize ||
      column < 0 ||
      column >= this.boardSize
    ) {
      console.log('{Ход выходит за пределы доски}');
      return false;
    }
    if (this.boardStatus[row][column]) {
      console.log('Ячейка уже занята');
      return false;
    }
    this.boardStatus[row][column] = this.currentPlayer;
    this.printBoard();
    if (this.checkWinner()) {
      console.log(`Игрок ${this.currentPlayer} победил!`);
      return true;
    }
    if (this.checkDraw()) {
      console.log('Ничья');
      return true;
    }
    this.togglePlayer();
    return false;
  }

  private checkWinner(): boolean {
    return (
      this.checkHorizontal() ||
      this.checkVertical() ||
      this.checkMainDiagonal() ||
      this.checkSecondDiagonal()
    );
  }

  private checkDraw(): boolean {
    return this.boardStatus.flat().every((cell) => cell !== CellStatus.EMPTY);
  }

  private checkLine(line: CellStatus[]): boolean {
    return line.every((cell) => cell !== CellStatus.EMPTY && cell === line[0]);
  }

  private checkHorizontal(): boolean {
    for (let index = 0; index < this.boardSize; index++) {
      if (this.checkLine(this.boardStatus[index])) {
        return true;
      }
    }
    return false;
  }

  private checkVertical(): boolean {
    for (let index = 0; index < this.boardSize; index++) {
      const columns = this.boardStatus.map((row) => row[index]);
      if (this.checkLine(columns)) {
        return true;
      }
    }
    return false;
  }

  private checkMainDiagonal(): boolean {
    const mainDiagonal: CellStatus[] = [];
    for (let index = 0; index < this.boardSize; index++) {
      mainDiagonal.push(this.boardStatus[index][index]);
    }
    return this.checkLine(mainDiagonal);
  }

  private checkSecondDiagonal(): boolean {
    const secondDiagonal: CellStatus[] = [];
    for (let index = 0; index < this.boardSize; index++) {
      secondDiagonal.push(this.boardStatus[index][this.boardSize - index - 1]);
    }
    return this.checkLine(secondDiagonal);
  }

  private togglePlayer(): void {
    this.currentPlayer =
      this.currentPlayer === CellStatus.X ? CellStatus.O : CellStatus.X;
  }
}

rl.question(`Введите размер поля: `, (answer) => {
  new GameNode(+answer);
});
