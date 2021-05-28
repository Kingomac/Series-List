import Component from "../interfaces/Component";
import "../styles/TopBar.scss";

export default class TopBar extends Component {
  private static attrTitle: string = "title";
  private titleSpan: HTMLSpanElement;

  static get observedAttributes() {
    return ["title"];
  }

  constructor() {
    super();
    this.titleSpan = document.createElement("span");
  }

  connectedCallback(): void {
    this.titleSpan.innerText = this.getAttribute("title") || "";
    this.append(this.titleSpan);
  }

  attributeChangedCallback(name: string, lastValue: any, newValue: any) {
    if (name == TopBar.attrTitle) {
      this.titleSpan.innerText = newValue;
    }
  }
}

window.customElements.define("sl-topbar", TopBar);
