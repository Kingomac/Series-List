import IComponent from "../interfaces/Component";
import { IAuthController } from "../interfaces/IAuthController";
import "../styles/TopBar.scss";

export default class TopBar extends IComponent {
  private static attrTitle: string = "title";
  private titleSpan: HTMLSpanElement;

  static get observedAttributes() {
    return ["title"];
  }

  constructor(private auth: IAuthController, private authModule: IComponent) {
    super();
    this.titleSpan = document.createElement("span");
  }

  connectedCallback(): void {
    this.titleSpan.innerText = this.getAttribute("title") || "";
    this.append(this.titleSpan, this.authModule);
  }

  attributeChangedCallback(name: string, lastValue: any, newValue: any) {
    if (name == TopBar.attrTitle) {
      this.titleSpan.innerText = newValue;
    }
  }
}

window.customElements.define("sl-topbar", TopBar);
