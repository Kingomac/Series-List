import { FakeClient } from "../../test/FakeClient";
import { FloatBottomMenu } from "../components/FloatBottomMenu";
import { SerieCard } from "../components/SerieCard";
import { ITab, Tab } from "../components/Tab";
import { TabsMenu } from "../components/TabsMenu";
import TopBar from "../components/TopBar";
import Component from "../interfaces/Component";
import "../styles/main.scss";

export default class Main extends Component {
  private topBar: TopBar;

  constructor() {
    super();
    this.topBar = new TopBar();
  }

  async connectedCallback(): Promise<void> {
    this.topBar.setAttribute("title", "Series List Next");

    const seriesDiv = document.createElement("div");
    seriesDiv.classList.add("series", "container");

    const tabs = new TabsMenu();

    const driver = new FakeClient();
    const floatMenu = new FloatBottomMenu();

    const series = await driver.getAllSeries();
    const categories = await driver.getAllCategories();
    let cards = series.map(
      async (serie) => new SerieCard(serie, await driver.getRandomCategory())
    );
    this.append(this.topBar, tabs, seriesDiv, floatMenu);
    cards.forEach(async (i) => {
      seriesDiv.append(await i);
    });
    await tabs.addAllTab(
      categories.map((c) => {
        return Object.assign(c, { url: "/" + c.name });
      })
    );
    console.log(tabs);
  }
}

window.customElements.define("sl-main", Main);
