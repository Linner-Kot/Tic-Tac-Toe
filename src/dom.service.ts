import { Settings } from './settings';

export class DomService {
  private static getElement(selector: string): HTMLElement {
    const element = document.querySelector(selector);
    if (element === null) {
      throw new Error(`Element ${selector} is missing from DOM`);
    }
    return element as HTMLElement;
  }

  static getAllElements(selector: string): NodeListOf<HTMLElement> {
    const element = document.querySelectorAll(selector);
    if (element === null) {
      throw new Error(`Element ${selector} is missing from DOM`);
    }
    return element as NodeListOf<HTMLElement>;
  }

  public static boardContainer = this.getElement(
    Settings.SELECTOR_BOARD_CONTAINER,
  );

  public static resetButton = this.getElement(
    Settings.SELECTOR_RESET_BUTTON,
  ) as HTMLButtonElement;

  public static sizeInput = this.getElement(
    Settings.SELECTOR_SIZE_INPUT,
  ) as HTMLInputElement;

  public static decreaseButton = this.getElement(
    Settings.SELECTOR_DECREASE_BUTTON,
  ) as HTMLButtonElement;

  public static increaseButton = this.getElement(
    Settings.SELECTOR_INCREASE_BUTTON,
  ) as HTMLButtonElement;

  public static getAllCells = () => this.getAllElements(Settings.SELECTOR_CELL);

  public static modal = this.getElement(Settings.SELECTOR_MODAL);

  public static modalCloseButton = this.getElement(
    Settings.SELECTOR_MODAL_CLOSE_BUTTON,
  );

  public static modalButton = this.getElement(Settings.SELECTOR_MODAL_BUTTON);

  public static modalMessage = this.getElement(Settings.SELECTOR_MODAL_MESSAGE);

  public static statistics = this.getElement(Settings.SELECTOR_STATISTICS);
}
