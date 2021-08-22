import IComponent from "../interfaces/Component";

export class FloatBottomMenu extends IComponent {
  onNewSerie?(): void;

  private addSerieBtn: HTMLButtonElement;

  constructor() {
    super();
    this.addSerieBtn = document.createElement("button");
  }

  connectedCallback(): void {
    this.append(this.addSerieBtn);
    this.addSerieBtn.innerText = "+";
    this.addSerieBtn.onclick = () => {
      this.onNewSerie!();
    };
  }
}

window.customElements.define("sl-float-bottom-menu", FloatBottomMenu);
