import IComponent from "../interfaces/Component";
import { AddSerieModal } from "./AddSerieModal";

export class FloatBottomMenu extends IComponent {
  private addSerieBtn: HTMLButtonElement;

  constructor(private modal: AddSerieModal) {
    super();
    this.addSerieBtn = document.createElement("button");
    this.addSerieBtn.innerText = "➕";
    this.addSerieBtn.onclick = () => {
      this.modal.setAttribute(AddSerieModal.observedAttributes[0], "visible");
    };
    this.append(this.addSerieBtn);
  }

  connectedCallback(): void {}
}

window.customElements.define("sl-float-bottom-menu", FloatBottomMenu);
