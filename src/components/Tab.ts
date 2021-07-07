import IComponent from "../interfaces/Component";
import { Category } from "../interfaces/Models";

export interface ITab extends Category {
  url: string;
}
export class Tab extends IComponent {
  public onActive?: () => void;

  constructor(public tab: ITab) {
    super();
    this.onclick = () => {
      history.pushState(null, "", this.tab.url);
      if (this.onActive != undefined) this.onActive();
    };
  }
  connectedCallback() {
    this.innerText = this.tab.name;
  }

  getData(): ITab {
    return this.tab;
  }
}

window.customElements.define("sl-tab", Tab);
