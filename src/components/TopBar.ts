import IComponent from "../interfaces/Component";
import { IAuthController } from "../interfaces/IAuthController";
import "../styles/TopBar.scss";

export default class TopBar extends IComponent {
  private static attrTitle: string = "title";
  private titleSpan: HTMLSpanElement = document.createElement("span");
  private fujiwara: HTMLImageElement = document.createElement("img");

  static get observedAttributes() {
    return ["title"];
  }

  constructor(private authModule: IComponent) {
    super();
  }

  connectedCallback(): void {
    this.titleSpan.innerText = this.getAttribute("title") || "";
    this.fujiwara.src = "https://tinyimg.io/i/PIZN54o.png";
    this.append(this.fujiwara, this.titleSpan, this.authModule);
  }

  attributeChangedCallback(name: string, lastValue: any, newValue: any) {
    if (name == TopBar.attrTitle) {
      this.titleSpan.innerText = newValue;
    }
  }
}

window.customElements.define("sl-topbar", TopBar);
