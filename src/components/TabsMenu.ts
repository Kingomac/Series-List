import { APP_NAME } from "../../app.config";
import IComponent from "../interfaces/Component";
import { Serie } from "../interfaces/Models";
import { ITab, Tab } from "./Tab";

export class TabsMenu extends IComponent {
  private tabs: Tab[];
  private addCategTab: Tab;

  onTabsClick?(tab: ITab): void;
  onSerieDrop?(x: { serie: Serie; categoryId: string }): void;
  onRequestDelete?(categId: string): Promise<void>;
  onRequestNewCateg?(): Promise<void>;

  static addTabId: string = "addtab";

  constructor() {
    super();
    this.tabs = [];
    this.addCategTab = new Tab({
      name: "Añadir",
      url: "",
    });
    this.addCategTab.onDropSerie = () => {
      alert("Eu non fago iso");
    };
    this.addCategTab.style.display = "none";
    this.addCategTab.id = "addtab";
    this.addCategTab.onclick = async () => await this.onRequestNewCateg!();
    this.addCategTab.onauxclick = async () => { };
  }

  connectedCallback() {
    this.showAddCategTab(false);
    this.append(this.addCategTab);
  }

  showAddCategTab(visible: boolean = true) {
    this.addCategTab.style.display = visible ? "block" : "none";
    console.log("showAddCategTab:", this.addCategTab.style.display);
  }

  async addTab(tab: ITab): Promise<void> {
    const newTab = new Tab(tab);
    newTab.onActive = async (_tab: ITab = tab) => {
      await this.setActiveTab(newTab);
      this.onTabsClick!(tab);
    };
    newTab.onDropSerie = (serie) => {
      this.onSerieDrop!({ serie, categoryId: tab._id! });
    };
    this.tabs.unshift(newTab);
    this.insertBefore(this.tabs[0], this.addCategTab);
  }

  async addAllTab(tabs: ITab[]): Promise<void> {
    const n = this.tabs.length;
    this.tabs = this.tabs.concat(
      tabs.map((t) => {
        const elT = new Tab(t);
        elT.onDropSerie = (serie) => {
          this.onSerieDrop!({ serie, categoryId: t._id! });
        };
        elT.onActive = async (tab: ITab = t) => {
          await this.setActiveTab(elT);
          this.onTabsClick!(tab);
        };
        elT.onDelete = this.onRequestDelete;
        return elT;
      })
    );
    for (let i = n; i < this.tabs.length; i++) {
      this.insertBefore(this.tabs[i], this.addCategTab);
    }
  }

  async setActiveTab(newTab: Tab) {
    this.tabs.forEach((i) => {
      i.setAttribute(Tab.observedAttributes[0], "false");
    });
    newTab.setAttribute(Tab.observedAttributes[0], "true"); // Attribute 'active'
    document.title = APP_NAME + " - " + newTab.tab.name;
  }

  async setActiveTabByPathname() {
    let i = 0;
    while (
      i < this.tabs.length &&
      this.tabs[i].tab._id !== window.location.pathname.replace("/", "")
    ) {
      i++;
    }
    await this.setActiveTab(this.tabs[i]);
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
  async clearTabs(): Promise<void> {
    //this.textContent = "";
    this.tabs.forEach((i) => i.remove());
    this.tabs = [];
  }
}

window.customElements.define("sl-tabs-menu", TabsMenu);
