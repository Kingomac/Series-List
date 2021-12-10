import { FirebaseApp } from "firebase/app";
import { APP_NAME } from "../../app.config";
import { AuthModuleAttributes } from "../components/auth/AuthModuleAttributes";
import FirebaseAuth from "../components/auth/FirebaseAuth";
import { FloatBottomMenu } from "../components/FloatBottomMenu";
import { ITab } from "../components/Tab";
import { TabsMenu } from "../components/TabsMenu";
import TopBar from "../components/TopBar";
import FirebaseAuthController, {
  AuthChangeEvent,
} from "../controllers/auth/FirebaseAuthController";
import FirebaseClient from "../controllers/db/FirebaseClient";
import AuthStatus from "../interfaces/AuthStatus";
import IComponent from "../interfaces/Component";
import { IDbClient } from "../interfaces/DbClient";
import { IAuthController } from "../interfaces/IAuthController";
import { Category, Serie } from "../interfaces/Models";
import { Route } from "../routes";
import "../styles/main.scss";
import "../styles/SeriesView.scss";

export default class SeriesView extends IComponent {
  private client: IDbClient;
  private auth: IAuthController;
  private app: FirebaseApp;

  // Categories
  private actualCategory: Category;
  private lastSerie?: Serie;

  //Components
  private floatBotMenu: FloatBottomMenu;
  private tabsMenu: TabsMenu;
  private seriesDiv: HTMLDivElement;
  private topBar: TopBar;
  private authModule: IComponent;
  private endDiv: HTMLDivElement;
  private viewDiv: HTMLDivElement;

  constructor(x: { app: FirebaseApp, changeView: (path: Route) => Promise<void> }) {
    super();
    this.app = x.app;
    this.auth = new FirebaseAuthController(this.app);

    //this.auth = new FakeAuth();

    this.authModule = new FirebaseAuth(this.auth as FirebaseAuthController);
    //this.authModule = new FakeAuthModule(this.auth);
    this.topBar = new TopBar({ authModule: this.authModule, changeView: x.changeView });
    this.client = new FirebaseClient(this.app);
    //this.client = new FakeClient();
    this.actualCategory = { name: "" };

    this.tabsMenu = new TabsMenu();

    this.viewDiv = document.createElement("div");
    this.viewDiv.className = "view-div";
    this.seriesDiv = document.createElement("div");
    this.endDiv = document.createElement("div");
    this.endDiv.className = "end-div";
    this.endDiv.setAttribute("active", "false");

    this.floatBotMenu = new FloatBottomMenu();

    this.tabsMenu.onTabsClick = async (tab: ITab) => {
      this.actualCategory = tab as Category;
      console.log("actualCategory:", this.actualCategory);
      if (this.actualCategory._id == undefined)
        throw new Error(
          "Category " + this.actualCategory.name + " id is undefined"
        );
      await this.updateSeries();
    };

    this.tabsMenu.onSerieDrop = async (x) => {
      console.log("Serie dropped:", x);
      const oldId = x.serie._id;
      await this.client.moveSerie(
        this.actualCategory._id!,
        x.categoryId,
        x.serie
      );
      await this.findAndDeleteCard(oldId!);
    };

    this.tabsMenu.onRequestDelete = async (categId) => {
      await this.client.deleteCategoryById(categId);
    };

    this.auth.onAuthChange = this.authChangeEvent;
  }

  authChangeEvent = async (x: AuthChangeEvent) => {
    console.log("Auth changed!");
    if (x.status === AuthStatus.SIGNED || x.status === AuthStatus.SUDO) {
      console.log("Logged");
      this.authModule.setAttribute(
        AuthModuleAttributes.logged.name,
        AuthModuleAttributes.logged.yes
      );
      const categories = await this.client.getAllCategories();
      if (categories.length > 0) {
        if (window.location.pathname === "/") {
          window.history.pushState(null, "", categories[0]._id!);
          this.actualCategory = categories[0];
        } else {
          let i = 0;
          while (
            i < categories.length &&
            categories[i]._id !== window.location.pathname.replace("/", "")
          ) {
            i++;
          }
          if (i === categories.length) {
            window.history.pushState(null, "", categories[0]._id!);
            this.actualCategory = categories[0];
          } else {
            this.actualCategory = categories[i];
          }
          console.log("actualCategory:", this.actualCategory);
        }
        await this.updateTabs(categories);
        await this.updateSeries();
        x.status === AuthStatus.SUDO
          ? this.append(this.floatBotMenu)
          : this.floatBotMenu.remove();
      }
    } else {
      console.log("Not logged");
      this.authModule.setAttribute(
        AuthModuleAttributes.logged.name,
        AuthModuleAttributes.logged.no
      );
      if (this.floatBotMenu.isConnected) this.floatBotMenu.remove();
    }
    this.tabsMenu.showAddCategTab(x.status === AuthStatus.SUDO);
  };

  async connectedCallback(): Promise<void> {
    this.append(this.topBar, this.tabsMenu, this.viewDiv);
    this.viewDiv.append(this.seriesDiv, this.endDiv);

    this.topBar.setAttribute("title", APP_NAME);
    this.seriesDiv.classList.add("series", "container");

    this.floatBotMenu.onNewSerie = async () => {
      const { AddSerieModal } = await import("../components/AddSerieModal");
      const modal = new AddSerieModal();
      this.append(modal);
      modal.onSubmit = async (serie) => {
        if (this.actualCategory._id === undefined)
          throw new Error("Category id is undefined");
        const id = await this.client.addSerie(serie, this.actualCategory._id);
        this.seriesDiv.insertBefore(
          (await this.createCards(Object.assign({ _id: id }, serie)))[0],
          this.seriesDiv.children[0]
        );
      };
    };

    this.floatBotMenu.onAltSwitch = (x) => {
      this.seriesDiv.querySelectorAll("sl-serie-card").forEach((i) => {
        i.setAttribute("alt", `${x.alt}`);
      });
    };

    this.tabsMenu.onRequestNewCateg = async () => {
      const { AddCategoryModal } = await import(
        "../components/AddCategoryModal"
      );
      const modal = new AddCategoryModal();
      this.append(modal);
      modal.onSubmit = async (categ) => {
        if (!this.floatBotMenu.isConnected) this.append(this.floatBotMenu);
        const id = await this.client.addCategory(categ);
        categ._id = id;
        this.tabsMenu.addTab((await this.createTabs(categ))[0]);
        if (window.location.pathname == "/") {
          window.history.pushState(null, "", id);
          this.actualCategory = categ;
          await this.updateSeries();
          await this.tabsMenu.setActiveTabByPathname();
        }
      };
    };

    this.endDiv.onmouseenter = async () => {
      console.log("Getting more series?:", this.endDiv.getAttribute("active"));
      if (this.endDiv.getAttribute("active") == "true") {
        this.endDiv.setAttribute("active", "false");
        if (this.lastSerie !== undefined) {
          console.log("Last serie:", this.lastSerie);
          const moreSeries = await this.client.getSeriesLimitAfter({
            categId: this.actualCategory._id!,
            start: this.lastSerie.timestamp!,
          });
          this.lastSerie = moreSeries[moreSeries.length - 1];
          console.log("More series:", moreSeries);
          const cards = await this.createCards.apply(this, moreSeries);
          cards.forEach((i) => this.seriesDiv.append(i));
          if (moreSeries.length > 0) {
            setTimeout(() => {
              this.endDiv.setAttribute("active", "true");
            }, 200);
          }
        }
      }
    };
  }

  /**
   * Creates cards from SeriesCard
   * @param series
   * @returns
   */
  async createCards(...series: Serie[]) {
    const { SerieCard } = await import("../components/SerieCard");
    return series.map(
      (s: Serie) =>
        new SerieCard(s, this.actualCategory._id || "", this.client, this.auth)
    );
  }

  async createTabs(...categs: Category[]): Promise<ITab[]> {
    return categs.map((c) => Object.assign(c, { url: "/" + c.name }));
  }

  async updateTabs(categories: Category[]) {
    await this.tabsMenu.clearTabs();
    await this.tabsMenu.addAllTab(
      await this.createTabs.apply(this, categories)
    );
    await this.tabsMenu.setActiveTabByPathname();
  }

  async updateSeries() {
    this.viewDiv.scrollTo({ top: 0, left: 0 });
    console.log("Updating series with category:", this.actualCategory);
    if (this.actualCategory._id === undefined) {
      throw new Error("Error with category " + this.actualCategory._id);
    }

    const series = await this.client.getSeriesLimitFirst({
      categId: this.actualCategory._id,
    });

    this.lastSerie = series[series.length - 1];

    this.seriesDiv.textContent = "";
    (await this.createCards.apply(this, series)).forEach((s) =>
      this.seriesDiv.append(s)
    );
    setTimeout(() => {
      this.endDiv.setAttribute("active", "true");
    }, 250);
  }

  async findAndDeleteCard(id: string) {
    const card = this.seriesDiv.querySelector("#" + id) as IComponent;
    if (card === null)
      throw new Error("Card to delete with id " + id + " is null");
    card.style.transition = "visibility 0.3s linear,opacity 0.3s linear";
    card.style.opacity = "0";
    card.style.visibility = "hidden";
    setTimeout(() => {
      card.remove();
    }, 1000);
  }
}

window.customElements.define("sl-series-view", SeriesView);
