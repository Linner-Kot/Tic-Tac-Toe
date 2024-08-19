export class DomService {
  getElement(selector: string): HTMLElement {
    return document.querySelector(selector) as HTMLElement;
  }

  getAllElements(selector: string): NodeListOf<HTMLElement> {
    return document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
  }
}
