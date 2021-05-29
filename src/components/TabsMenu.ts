import Component from "../interfaces/Component";
import { Category } from "../interfaces/Models";
import { ITab, Tab } from "./Tab";

export class TabsMenu extends Component {
  tabs: Tab[];

  constructor() {
    super();
    this.tabs = [];
  }

  connectedCallback() {}

  async addTab(tab: ITab): Promise<void> {
    this.tabs.push(new Tab(tab));
    this.append(this.tabs[this.tabs.length - 1]);
  }

  async addAllTab(tabs: ITab[]): Promise<void> {
    const n = this.tabs.length;
    this.tabs = this.tabs.concat(
      tabs.map((t) => {
        return new Tab(t);
      })
    );
    for (let i = n; i < this.tabs.length; i++) {
      this.append(this.tabs[i]);
    }
  }

  async deleteTab(tab: ITab): Promise<void> {
    let i = 0;
    while (i < this.tabs.length || this.tabs[i].getData() != tab) {
      i++;
    }
    if (this.tabs[i].getData() != tab) {
      throw new Error("Tab is not in the tabs menu");
    }
    this.removeChild(this.tabs[i]);
    this.tabs.splice(i, 1);
  }
}

window.customElements.define("sl-tabs-menu", TabsMenu);
