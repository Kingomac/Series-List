import IComponent from "../interfaces/Component";

export class FloatBottomMenu extends IComponent {
  onNewSerie?(): void;
  onAltSwitch?(x: { alt: boolean }): void;

  private addSerieBtn: HTMLButtonElement = document.createElement("button");
  private switchAltBtn: HTMLButtonElement = document.createElement("button");
  private alt: boolean = false;

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.append(this.switchAltBtn, this.addSerieBtn);
    this.switchAltBtn.innerText = "🇯🇵";
    this.switchAltBtn.onclick = () => {
      this.alt = !this.alt;
      this.switchAltBtn.innerText = this.alt ? "🇬🇧" : "🇯🇵";
      this.onAltSwitch!({ alt: this.alt });
    };
    this.addSerieBtn.innerText = "+";
    this.addSerieBtn.onclick = () => {
      this.onNewSerie!();
    };
  }
}

window.customElements.define("sl-float-bottom-menu", FloatBottomMenu);
