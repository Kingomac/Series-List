import Component from "../interfaces/Component";
import { AddSerieModal } from "./AddSerieModal";

export class FloatBottomMenu extends Component {
  constructor(private modal: AddSerieModal) {
    super();
    console.log(this.modal);
  }

  connectedCallback(): void {
    const addSerieBtn = document.createElement("button");
    addSerieBtn.innerText = "➕";
    addSerieBtn.onclick = () => {
      this.modal.setAttribute(AddSerieModal.observedAttributes[0], "visible");
    };
    this.append(addSerieBtn);
  }
}

window.customElements.define("sl-float-bottom-menu", FloatBottomMenu);
