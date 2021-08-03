import IComponent from "../interfaces/Component";
import { Category, Serie } from "../interfaces/Models";

export interface ITab extends Category {
  url: string;
}
export class Tab extends IComponent {
  public onActive?: () => void;
  public onDropSerie?: (serie: Serie) => void;
  public onDelete?: (categId: string) => Promise<void>;

  static get observedAttributes() {
    return ["active"];
  }

  constructor(public tab: ITab) {
    super();
    this.onclick = () => {
      history.pushState(null, "", this.tab._id!);
      this.onActive!();
    };
  }
  connectedCallback() {
    this.innerText = this.tab.name;
  }

  onauxclick = async (ev: MouseEvent) => {
    if (ev.button === 2) {
      ev.preventDefault();
      const del = confirm(
        "¿Quieres eliminar esta categoría con todas las series que pertenecen a ella?"
      );
      if (del) {
        this.style.transition = "opacity .3s linear, visibility .3s linear";
        this.style.opacity = "0";
        this.style.visibility = "hidden";
        await this.onDelete!(this.tab._id!);
        setTimeout(() => {
          this.remove();
        }, 350);
      }
    }
  };

  ondrop = (ev: DragEvent) => {
    const data = ev.dataTransfer?.getData("serie");
    if (data === undefined) throw new Error("Serie dragged is undefined");
    const serie = JSON.parse(data) as Serie;
    console.log("Serie dragged:", serie);
    this.onDropSerie!(serie);
  };

  ondragover = (ev: DragEvent) => {
    ev.preventDefault();
  };

  getData(): ITab {
    return this.tab;
  }
  attributeChangedCallback(name: string, lastValue: any, newValue: any) {
    if (name == Tab.observedAttributes[0]) {
      if (newValue === "true") {
        this.style.borderBottomColor = "red";
      } else {
        this.style.borderBottomColor = "black";
      }
    }
  }
}

window.customElements.define("sl-tab", Tab);
