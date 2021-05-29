import Component from "../interfaces/Component";
import { Category } from "../interfaces/Models";

export interface ITab extends Category {
  url: string;
}
export class Tab extends Component {
  public onActive?: () => void;

  constructor(private tab: ITab) {
    super();
  }
  connectedCallback() {
    this.innerText = this.tab.name;
    this.onclick = (event: MouseEvent) => {
      history.pushState(null, "", this.tab.url);
      if (this.onActive != undefined) this.onActive();
    };
  }

  getData(): ITab {
    return this.tab;
  }
}

window.customElements.define("sl-tab", Tab);
