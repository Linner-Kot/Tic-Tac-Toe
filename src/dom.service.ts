import { Settings } from './settings';

export class DomService {
  constructor() {}
  private static getElement(selector: string): HTMLElement {
    return document.querySelector(selector) as HTMLElement;
  }

  static getAllElements(selector: string): NodeListOf<HTMLElement> {
    return document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
  }

  public static boardContainer = this.getElement(
    Settings.SELECTOR_BOARD_CONTAINER,
  );

  public static resetButton = document.querySelector(
    Settings.SELECTOR_RESET_BUTTON,
  ) as HTMLButtonElement;

  public static sizeInput = document.querySelector(
    Settings.SELECTOR_SIZE_INPUT,
  ) as HTMLInputElement;

  public static decreaseButton = document.querySelector(
    Settings.SELECTOR_DECREASE_BUTTON,
  ) as HTMLButtonElement;

  public static increaseButton = document.querySelector(
    Settings.SELECTOR_INCREASE_BUTTON,
  ) as HTMLButtonElement;

  public static getAllCells = () =>
    document.querySelectorAll(Settings.SELECTOR_CELL);

  public static modal = this.getElement(Settings.SELECTOR_MODAL);

  public static modalCloseButton = this.getElement(
    Settings.SELECTOR_MODAL_CLOSE_BUTTON,
  );

  public static modalButton = this.getElement(Settings.SELECTOR_MODAL_BUTTON);

  public static modalMessage = this.getElement(Settings.SELECTOR_MODAL_MESSAGE);
}
