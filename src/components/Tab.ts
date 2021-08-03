import IComponent from "../interfaces/Component";
import { Category, Serie } from "../interfaces/Models";

export interface ITab extends Category {
  url: string;
}
export class Tab extends IComponent {
  public onActive?: () => void;
  public onDropSerie?: (serie: Serie) => void;

  constructor(public tab: ITab) {
    super();
    this.onclick = () => {
      history.pushState(null, "", this.tab.url);
      if (this.onActive != undefined) this.onActive();
    };
  }
  connectedCallback() {
    this.innerText = this.tab.name;
    this.ondrop = (ev) => {
      const data = ev.dataTransfer?.getData("serie");
      if (data === undefined) throw new Error("Serie dragged is undefined");
      const serie = JSON.parse(data) as Serie;
      console.log("Serie dragged:", serie);
      this.onDropSerie!(serie);
    };
    this.ondragover = (ev) => {
      ev.preventDefault();
    };
  }

  getData(): ITab {
    return this.tab;
  }
}

window.customElements.define("sl-tab", Tab);
