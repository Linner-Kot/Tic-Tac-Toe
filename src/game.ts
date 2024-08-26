import { DomService } from './dom.service';
import { CellStatus } from './game-cell';
import { Modal } from './modal';
import { MAX_BOARD_SIZE, MIN_BOARD_SIZE } from './settings';

export class Game {
  private boardStatus: CellStatus[][] = [];
  private currentPlayer: CellStatus = CellStatus.EMPTY;
  private boardSize: number;

  private readonly boardElement = DomService.boardContainer;
  private readonly resetButtonElement = DomService.resetButton;
  private readonly sizeInputElement = DomService.sizeInput;
  private readonly decreaseButtonElement = DomService.decreaseButton;
  private readonly increaseButtonElement = DomService.increaseButton;

  constructor(private modal = new Modal()) {
    this.boardSize = this.getSizeFromLocalStorage();
    this.initInputField();
    this.initResetButton();
    this.fillBoardTemplate();
    this.updateStatisticsDisplay(this.getGameStatistics()); // TODO Отображаем статистику при загрузке
    this.reset();
  }

  /** Инициализация поля ввода и установка обработчика событий */
  private initInputField(): void {
    if (this.sizeInputElement) {
      this.sizeInputElement.value = this.boardSize.toString();
      this.decreaseButtonElement.addEventListener('click', () => {
        if (this.boardSize > MIN_BOARD_SIZE) {
          this.boardSize--;
          this.sizeInputElement.value = this.boardSize.toString();
          this.updateSize(this.sizeInputElement.value);
        }
        this.toggleButtonStates();
      });
      this.increaseButtonElement.addEventListener('click', () => {
        if (this.boardSize < MAX_BOARD_SIZE) {
          this.boardSize++;
          this.sizeInputElement.value = this.boardSize.toString();
          this.updateSize(this.sizeInputElement.value);
        }
        this.toggleButtonStates();
      });
      this.toggleButtonStates();
    }
  }

  private initResetButton(): void {
    this.resetButtonElement.addEventListener('click', () => this.reset());
  }

  /** Сбрасывает текущего игрока и обнуляет игровую доску */
  public reset(): void {
    this.currentPlayer = CellStatus.X;
    this.boardStatus = Array.from({ length: this.boardSize }, () =>
      Array.from({ length: this.boardSize }, () => CellStatus.EMPTY),
    );
    if (this.boardElement) {
      const cells = DomService.getAllCells();
      for (const cell of cells) {
        cell.textContent = '';
      }
    }
    this.boardElement.removeEventListener('mousedown', this.cellClickHandler);
    this.boardElement.addEventListener('mousedown', this.cellClickHandler);
  }

  /** Заполняет контейнер доски ячейками */
  private fillBoardTemplate(): void {
    if (this.boardElement) {
      this.boardElement.innerHTML = '';
      this.boardElement.style.gridTemplateRows = `repeat(${this.boardSize}, 1fr)`;
      this.boardElement.style.gridTemplateColumns = `repeat(${this.boardSize}, 1fr)`;
      const fragment = document.createDocumentFragment();
      for (let row = 0; row < this.boardSize; row++) {
        for (let col = 0; col < this.boardSize; col++) {
          fragment.append(this.createCellTemplate(row, col));
        }
      }
      this.boardElement.append(fragment);
    }
  }

  /** Создание HTML-разметки для одной ячейки */
  private createCellTemplate(row: number, col: number): HTMLElement {
    const cellTemplate = document.createElement('div');
    cellTemplate.classList.add('cell');
    if (row < this.boardSize - 1) {
      cellTemplate.classList.add('cell_border-bottom');
    }
    if (col < this.boardSize - 1) {
      cellTemplate.classList.add('cell_border-right');
    }
    cellTemplate.dataset.x = row.toString();
    cellTemplate.dataset.y = col.toString();
    return cellTemplate;
  }

  private toggleButtonStates(): void {
    this.decreaseButtonElement.disabled = this.boardSize <= MIN_BOARD_SIZE;
    this.increaseButtonElement.disabled = this.boardSize >= MAX_BOARD_SIZE;
  }

  /** Обновление значения размера и сохранение в LocalStorage */
  private updateSize(newSize: string): void {
    const parsedSize = Number.parseInt(newSize, 10);
    if (
      !Number.isNaN(parsedSize) &&
      parsedSize >= MIN_BOARD_SIZE &&
      parsedSize <= MAX_BOARD_SIZE
    ) {
      this.boardSize = parsedSize;
      localStorage.setItem('boardSize', this.boardSize.toString());
      this.fillBoardTemplate();
      this.reset();
    }
  }

  public makeMove(row: number, column: number, target: HTMLElement): boolean {
    if (
      row < 0 ||
      row >= this.boardSize ||
      column < 0 ||
      column >= this.boardSize
    ) {
      console.error('{Ход выходит за пределы доски}');
      return false;
    }
    if (this.boardStatus[row][column] !== CellStatus.EMPTY) {
      this.modal.showModal('Эта ячейка уже занята');
      return false;
    }

    target.textContent = this.currentPlayer;
    target.classList.add(this.currentPlayer);
    this.boardStatus[row][column] = this.currentPlayer;
    if (this.checkWinner()) {
      this.boardElement.removeEventListener('mousedown', this.cellClickHandler);
      this.saveGameResult(`Победил игрок ${this.currentPlayer}`); // TODO
      this.modal.showModal(
        `Игрок ${this.currentPlayer} победил!`,
        true,
        this.reset.bind(this),
      );
      return true;
    }
    if (this.checkDraw()) {
      this.boardElement.removeEventListener('mousedown', this.cellClickHandler);
      this.saveGameResult('Ничья'); // TODO
      this.modal.showModal('Ничья', true, this.reset.bind(this));
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

  private cellClickHandler = (event: Event): void => {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const row = +target.dataset.x!;
    const col = +target.dataset.y!;
    this.makeMove(row, col, target);
  };

  private getSizeFromLocalStorage(): number {
    const storedSize = localStorage.getItem('boardSize');
    return storedSize ? Number.parseInt(storedSize, 10) : MIN_BOARD_SIZE;
  }

  /** Обновление значения размера и сохранение в LocalStorage */
  // private updateSize(newSize: string): void {
  //   const parsedSize = Number.parseInt(newSize, 10);
  //   if (
  //     !Number.isNaN(parsedSize) &&
  //     parsedSize >= MIN_BOARD_SIZE &&
  //     parsedSize <= MAX_BOARD_SIZE
  //   ) {
  //     this.boardSize = parsedSize;
  //     localStorage.setItem('boardSize', this.boardSize.toString());
  //     this.fillBoardTemplate();
  //     this.reset();
  //   }
  // }

  private saveGameResult(result: string): void {
    const statsKey = 'gameStatistics';
    const gameStatistics = JSON.parse(localStorage.getItem(statsKey) || '[]');
    if (gameStatistics.length >= 10) {
      gameStatistics.shift();
    }

    gameStatistics.push(result);
    localStorage.setItem(statsKey, JSON.stringify(gameStatistics));
    this.updateStatisticsDisplay(gameStatistics);
  }

  private getGameStatistics(): string[] {
    return JSON.parse(localStorage.getItem('gameStatistics') || '[]');
  }

  private updateStatisticsDisplay(statistics: string[]): void {
    const statisticsElement = document.querySelector('.statistics');
    if (statisticsElement) {
      statisticsElement.innerHTML = statistics
        .map((result, index) => `${index + 1}: ${result}`)
        .join('<br>');
    }
  }
}
