import { DomService } from './dom.service';

export class Modal {
  private modal = DomService.modal;
  private modalCloseButton = DomService.modalCloseButton;
  private modalButton = DomService.modalButton;
  private modalMessage = DomService.modalMessage;

  constructor() {
    this.initModal();
  }

  private hideModal = (): void => {
    this.modal.style.display = 'none';
  };

  private initModal(): void {
    this.modalCloseButton.addEventListener('click', this.hideModal);
    window.addEventListener('click', (event) => {
      if (event.target === this.modal) {
        this.hideModal();
      }
    });
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.hideModal();
      }
    });
  }

  public showModal(
    message: string,
    endGame?: boolean,
    callback?: () => void,
  ): void {
    this.resetState();
    this.modalMessage.textContent = message;
    this.modal.style.display = 'block';
    this.modalButton.addEventListener('click', this.hideModal);

    if (endGame && callback) {
      this.modalButton.textContent = 'Новая игра';
      this.modalButton.addEventListener('click', callback);
    }
  }

  private resetState(): void {
    this.modalButton.textContent = 'OK';
    const newModalButton = this.modalButton.cloneNode(true) as HTMLElement;
    this.modalButton.replaceWith(newModalButton);
    this.modalButton = newModalButton;
  }
}
