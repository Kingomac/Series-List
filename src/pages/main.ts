import TopBar from "../components/TopBar";
import Component from "../interfaces/Component";
import "../styles/main.scss";

export default class Main extends Component {
  private topBar: TopBar;

  constructor() {
    super();
    this.topBar = new TopBar();
  }

  connectedCallback(): void {
    this.topBar.setAttribute("title", "Series List Next");
    this.append(this.topBar);
  }
}

window.customElements.define("sl-main", Main);
