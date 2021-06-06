import { FakeClient } from "../../test/FakeClient";
import { AddSerieModal } from "../components/AddSerieModal";
import { FloatBottomMenu } from "../components/FloatBottomMenu";
import { SerieCard } from "../components/SerieCard";
import { ITab, Tab } from "../components/Tab";
import { TabsMenu } from "../components/TabsMenu";
import TopBar from "../components/TopBar";
import Component from "../interfaces/Component";
import { Category, Serie } from "../interfaces/Models";
import "../styles/main.scss";

export default class Main extends Component {
  private topBar: TopBar;
  private actualCategory: Category;

  constructor() {
    super();
    this.topBar = new TopBar();
    this.actualCategory = { name: "" };
  }

  async connectedCallback(): Promise<void> {
    this.topBar.setAttribute("title", "Series List Next");

    const seriesDiv = document.createElement("div");
    seriesDiv.classList.add("series", "container");

    const tabs = new TabsMenu();

    const client = new FakeClient();
    const modal = new AddSerieModal(client);
    const floatMenu = new FloatBottomMenu(modal);

    let series: Serie[] = await client.getAllSeries();
    const categories: Category[] = await client.getAllCategories();
    let cards = await this.createCards(series);
    this.append(this.topBar, tabs, seriesDiv, floatMenu, modal);
    cards.forEach(async (i) => {
      seriesDiv.append(i);
    });
    await tabs.addAllTab(
      categories.map((c) => {
        return Object.assign(c, { url: "/" + c.name });
      })
    );
    tabs.onTabsClick = async (tab: ITab) => {
      this.actualCategory = tab as Category;
      if (this.actualCategory._id == undefined)
        throw new Error(
          "Category " + this.actualCategory.name + " id is undefined"
        );
      series = await client.getSeriesByCategoryId(this.actualCategory._id);
      cards = await this.createCards(series);
      seriesDiv.textContent = "";
      cards.forEach((i) => {
        seriesDiv.append(i);
      });
    };
  }

  async createCards(series: Serie[]): Promise<SerieCard[]> {
    return series.map((s: Serie) => new SerieCard(s, this.actualCategory));
  }
}

window.customElements.define("sl-main", Main);
