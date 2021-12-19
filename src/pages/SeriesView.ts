import { APP_NAME } from "../../app.config";
import FirebaseAuth from "../components/auth/FirebaseAuth";
import { FloatBottomMenu } from "../components/FloatBottomMenu";
import { ITab } from "../components/Tab";
import { TabsMenu } from "../components/TabsMenu";
import TopBar from "../components/TopBar";
import FirebaseAuthController, {
  AuthChangeEvent,
} from "../controllers/auth/FirebaseAuthController";
import AuthStatus from "../interfaces/AuthStatus";
import IComponent from "../interfaces/Component";
import { IDbClient } from "../interfaces/DbClient";
import { IAuthController } from "../interfaces/IAuthController";
import { Category, Serie } from "../interfaces/Models";
import { Route } from "../routes";
import "../styles/SeriesView.scss";
import View from "../interfaces/View";
////////////////////////////////////////////////////////////
import { AddSerieModal } from "../components/AddSerieModal";
import { AddCategoryModal } from "../components/AddCategoryModal";
import { SerieCard } from "../components/SerieCard";
////////////////////////////////////////////////////////////

export default class SeriesView extends View {
  private client: IDbClient;

  // Categories
  private actualCategory: Category;
  private lastSerie?: Serie;

  //Components
  private floatBotMenu: FloatBottomMenu;
  private tabsMenu: TabsMenu;
  private seriesDiv: HTMLDivElement;
  private endDiv: HTMLDivElement;
  private viewDiv: HTMLDivElement;

  private lastAuthEvent: AuthChangeEvent = { status: AuthStatus.ANONYMOUS };

  constructor(x: {
    dbClient: IDbClient;
    changeView: (path: Route) => Promise<void>;
  }) {
    super();

    this.client = x.dbClient;
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
  }

  async authChangeEvent(x: AuthChangeEvent) {
    console.log("Auth changed!");
    this.lastAuthEvent = x;
    if (x.status === AuthStatus.SIGNED || x.status === AuthStatus.SUDO) {
      console.log("Logged");
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
      if (this.floatBotMenu.isConnected) this.floatBotMenu.remove();
    }
    this.tabsMenu.showAddCategTab(x.status === AuthStatus.SUDO);
    for await (const i of this.querySelectorAll<SerieCard>("sl-serie-card")) {
      await i.authChangeEvent(x);
    }
  }

  async connectedCallback(): Promise<void> {
    this.append(this.tabsMenu, this.viewDiv);
    this.viewDiv.append(this.seriesDiv, this.endDiv);

    this.seriesDiv.classList.add("series", "container");

    this.floatBotMenu.onNewSerie = async () => {
      //const { AddSerieModal } = await import("../components/AddSerieModal");
      const modal = new AddSerieModal();
      this.append(modal);
      modal.onSubmit = async (serie) => {
        if (this.actualCategory._id === undefined)
          throw new Error("Category id is undefined");
        const id = await this.client.addSerie(serie, this.actualCategory._id);
        this.seriesDiv.insertBefore(
          (
            await Promise.all(
              await this.createCards(Object.assign({ _id: id }, serie))
            )
          )[0],
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
      /*const { AddCategoryModal } = await import(
        "../components/AddCategoryModal"
      );*/
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
          const cards = await Promise.all(
            await this.createCards.apply(this, moreSeries)
          );
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
    console.log("Creating cards");
    //const { SerieCard } = await import("../components/SerieCard");
    return series.map(async (s: Serie) => {
      const card = new SerieCard(s, this.actualCategory._id || "", this.client);
      await card.authChangeEvent(this.lastAuthEvent);
      return card;
    });
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
    (await this.createCards.apply(this, series)).forEach(async (s) =>
      this.seriesDiv.append(await s)
    );
    setTimeout(() => {
      this.endDiv.setAttribute("active", "true");
    }, 250);
  }

  async findAndDeleteCard(id: string) {
    const card = this.seriesDiv.querySelector("#" + id) as SerieCard;
    card.draggable = false;
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
