import Component from "../interfaces/Component";

export interface ITab {
  title: string;
  url: string;
}

export class TabsMenu extends Component {
  private tabs: ITab[];

  private tabsEls: HTMLDivElement[];

  constructor() {
    super();
    this.tabs = [];
    this.tabsEls = [];
  }

  connectedCallback() {}

  addTab(...tabs: ITab[]): void {
    this.tabs.concat(tabs);
    const newTabsEls = tabs.map((tab) => {
      const el = document.createElement("div");
      el.classList.add("sl", "tab", "menu");
      el.innerText = tab.title;
      this.append(el);
      return el;
    });
    this.tabsEls.concat(newTabsEls);
  }

  clearTabs() {
    this.tabs = [];
  }
}
