import { DomService } from './dom.service';
import { CellStatus } from './game-cell';
import { Settings } from './settings';

export class Game {
  private board: CellStatus[][] = [];
  private currentPlayer: CellStatus = CellStatus.EMPTY;
  private size: number;

  constructor(private domService = new DomService()) {
    this.size = this.getSizeFromLocalStorage();
    this.initInputField();
    this.initResetButton();
    this.initModal();
    this.initGame();
  }

  private initGame(): void {
    this.reset();
    this.fillBoardTemplate();
  }

  /** Сбрасывает текущего игрока и обнуляет игровую доску */
  public reset(): void {
    this.currentPlayer = CellStatus.X;
    this.board = Array.from({ length: this.size }, () =>
      Array.from({ length: this.size }, () => CellStatus.EMPTY),
    );
    const boardTemplate = this.domService.getElement(
      Settings.SELECTOR_BOARD_CONTAINER,
    );
    if (boardTemplate) {
      const cells = this.domService.getAllElements('.cell');
      for (const cell of cells) {
        cell.textContent = '';
      }
    }
  }

  /** Настройка кнопки сброса */
  private initResetButton(): void {
    const resetButton = document.querySelector(
      Settings.SELECTOR_RESET_BUTTON,
    ) as HTMLElement;
    resetButton.addEventListener('click', () => this.reset());
  }

  /** Инициализация поля ввода и установка обработчика событий */
  private initInputField(): void {
    const sizeInput = document.querySelector('.size-input') as HTMLInputElement;
    const decreaseButton = document.querySelector(
      '#decrease',
    ) as HTMLButtonElement;
    const increaseButton = document.querySelector(
      '#increase',
    ) as HTMLButtonElement;

    if (sizeInput) {
      sizeInput.value = this.size.toString();

      decreaseButton.addEventListener('click', () => {
        if (this.size > 2) {
          this.size--;
          sizeInput.value = this.size.toString();
          this.updateSize(sizeInput.value);
        }
        this.toggleButtonStates(decreaseButton, increaseButton);
      });

      increaseButton.addEventListener('click', () => {
        if (this.size < 9) {
          this.size++;
          sizeInput.value = this.size.toString();
          this.updateSize(sizeInput.value);
        }
        this.toggleButtonStates(decreaseButton, increaseButton);
      });

      this.toggleButtonStates(decreaseButton, increaseButton); // Изначальная проверка
    }
  }

  private toggleButtonStates(
    decreaseButton: HTMLButtonElement,
    increaseButton: HTMLButtonElement,
  ): void {
    decreaseButton.disabled = this.size <= 2;
    increaseButton.disabled = this.size >= 9;
  }

  /** Обновление значения размера и сохранение в LocalStorage */
  private updateSize(newSize: string): void {
    const parsedSize = Number.parseInt(newSize, 10);
    if (!Number.isNaN(parsedSize) && parsedSize >= 2 && parsedSize <= 9) {
      this.size = parsedSize;
      localStorage.setItem('boardSize', this.size.toString());
      this.initGame();
    }
  }

  public makeMove(row: number, column: number, target: HTMLElement): boolean {
    console.info(this.board);
    if (row < 0 || row >= this.size || column < 0 || column >= this.size) {
      console.log('{Ход выходит за пределы доски}');
      // throw new Error('Ход выходит за пределы доски')
      return false;
    }
    if (this.board[row][column] !== CellStatus.EMPTY) {
      console.log('Ячейка уже занята');
      this.showModal('Эта ячейка уже занята');
      // throw new Error('Ячейка уже занята')
      return false;
    }
    target.textContent = this.currentPlayer;
    this.board[row][column] = this.currentPlayer;
    if (this.checkWinner()) {
      console.log(`Игрок ${this.currentPlayer} победил!`);
      this.showModal(`Игрок ${this.currentPlayer} победил!`, true);
      return true;
    }
    this.currentPlayer =
      this.currentPlayer === CellStatus.X ? CellStatus.O : CellStatus.X;
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

  private checkLine(line: CellStatus[]): boolean {
    return line.every((cell) => cell !== CellStatus.EMPTY && cell === line[0]);
  }

  private checkHorizontal(): boolean {
    for (let index = 0; index < this.size; index++) {
      if (this.checkLine(this.board[index])) {
        return true;
      }
    }
    return false;
  }

  private checkVertical(): boolean {
    for (let index = 0; index < this.size; index++) {
      const columns = this.board.map((row) => row[index]);
      if (this.checkLine(columns)) {
        return true;
      }
    }
    return false;
  }

  private checkMainDiagonal(): boolean {
    const mainDiagonal: CellStatus[] = [];
    for (let index = 0; index < this.size; index++) {
      mainDiagonal.push(this.board[index][index]);
    }
    return this.checkLine(mainDiagonal);
  }

  private checkSecondDiagonal(): boolean {
    const secondDiagonal: CellStatus[] = [];
    for (let index = 0; index < this.size; index++) {
      secondDiagonal.push(this.board[index][this.size - index - 1]);
    }
    return this.checkLine(secondDiagonal);
  }

  /** Заполняет контейнер доски ячейками */
  private fillBoardTemplate(): void {
    const boardTemplate = this.domService.getElement(
      Settings.SELECTOR_BOARD_CONTAINER,
    );

    if (boardTemplate) {
      boardTemplate.innerHTML = '';
      const fragment = document.createDocumentFragment();
      boardTemplate.style.display = 'grid';
      boardTemplate.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;
      boardTemplate.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          fragment.append(this.createCellTemplate(row, col));
        }
      }
      boardTemplate.append(fragment);
      boardTemplate.addEventListener('click', (event) => {
        event.preventDefault();
        const target = event.target as HTMLElement;
        const row = +target.dataset.x!;
        const column = +target.dataset.y!;
        this.makeMove(row, column, target);
      });
    }
  }

  /** Создание HTML-разметки для одной ячейки */
  private createCellTemplate(row: number, col: number): HTMLElement {
    const cellTemplate = document.createElement('div');
    cellTemplate.classList.add('cell');
    if (row < this.size - 1) {
      cellTemplate.style.borderBottom = '2px solid #ccc';
    }
    if (col < this.size - 1) {
      cellTemplate.style.borderRight = '2px solid #ccc';
    }
    cellTemplate.dataset.x = row.toString();
    cellTemplate.dataset.y = col.toString();
    return cellTemplate;
  }

  /** Получение размера доски из localStorage */
  private getSizeFromLocalStorage(): number {
    const storedSize = localStorage.getItem('boardSize');
    return storedSize ? Number.parseInt(storedSize, 10) : 3;
  }

  /** Инициализация модального окна */
  private initModal(): void {
    const modal = this.domService.getElement('#modal');
    const closeModal = this.domService.getElement('.modal-close');
    const modalButton = this.domService.getElement('#modal-button');

    closeModal.addEventListener('click', () => {
      modal!.style.display = 'none';
    });

    modalButton!.addEventListener('click', () => {
      modal!.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal!.style.display = 'none';
      }
    });
  }

  //** Показ модального окна */
  private showModal(message: string, endGame?: boolean): void {
    const modal = this.domService.getElement('#modal');
    const modalMessage = this.domService.getElement('#modal-message');
    const modalButton = this.domService.getElement('#modal-button');

    modalMessage.textContent = message;
    if (endGame) {
      modalButton.textContent = 'Новая игра';
      modalButton.addEventListener('click', () => {
        this.reset();
      });
      // TODO block click on board
    } else {
      modalButton.textContent = 'OK';
    }
    modal!.style.display = 'block';
  }
}
