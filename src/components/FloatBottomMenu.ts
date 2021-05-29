import Component from "../interfaces/Component";

export class FloatBottomMenu extends Component {
  constructor() {
    super();
  }

  connectedCallback(): void {
    const addSerieBtn = document.createElement("button");
    addSerieBtn.innerText = "➕";
    this.append(addSerieBtn);
  }
}

window.customElements.define("sl-float-bottom-menu", FloatBottomMenu);
