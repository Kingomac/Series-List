import { Timestamp } from "firebase/firestore";
import WSAuthController from "../controllers/auth/WSAuthController";
import IComponent from "../interfaces/Component";
import { IAuthController } from "../interfaces/IAuthController";
import { Category } from "../interfaces/Models";
import { AddCategoryModal } from "./AddCategoryModal";
import { ITab, Tab } from "./Tab";

export class TabsMenu extends IComponent {
  private tabs: Tab[];

  onTabsClick?(tab: ITab): void;

  static addTabId: string = "addtab";

  private addCategTab: Tab = new Tab({
    name: "Añadir",
    url: "",
  });

  constructor(
    private addTabModal: AddCategoryModal,
    private authController: IAuthController
  ) {
    super();
    this.tabs = [];
    this.addCategTab.style.display = "none";
    this.addCategTab.id = "addtab";
    this.addCategTab.onclick = () => {
      this.addTabModal.setAttribute("visibility", "visible");
    };
    this.tabs.push(this.addCategTab);
  }

  connectedCallback() {
    this.append(this.addCategTab);
  }

  showAddCategTab(visible: boolean = true) {
    this.addCategTab.style.display = visible ? "block" : "none";
    console.log("showAddCategTab:", this.addCategTab.style.display);
  }

  async addTab(tab: ITab): Promise<void> {
    this.tabs.unshift(new Tab(tab));
    this.insertBefore(this.tabs[0], this.children.item(0));
  }

  async addAllTab(tabs: ITab[]): Promise<void> {
    const n = this.tabs.length;
    this.tabs = this.tabs.concat(
      tabs.map((t) => {
        const elT = new Tab(t);
        elT.onActive = (tab: ITab = t) => {
          this.onTabsClick!(tab);
        };
        return elT;
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
  async clearTabs(): Promise<void> {
    //this.textContent = "";
    this.tabs.forEach((i) => {
      i.remove();
    });

    this.tabs = [];
  }
}

window.customElements.define("sl-tabs-menu", TabsMenu);
