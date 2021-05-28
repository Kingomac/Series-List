import { FakeClient } from "../../test/FakeClient";
import { SerieCard } from "../components/SerieCard";
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
    const driver = new FakeClient();
    let series = await driver.getAllSeries();
    let cards = series.map(
      async (serie) => new SerieCard(serie, await driver.getRandomCategory())
    );
    this.append(this.topBar, seriesDiv);
    cards.forEach(async (i) => {
      seriesDiv.append(await i);
    });
  }
}

window.customElements.define("sl-main", Main);
