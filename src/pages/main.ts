import { FirebaseApp, initializeApp } from "firebase/app";
import { FirebaseKeys } from "../../app.config";
import FakeAuth from "../../test/FakeAuth";
import { FakeClient } from "../../test/FakeClient";
import { AddCategoryModal } from "../components/AddCategoryModal";
import { AddSerieModal } from "../components/AddSerieModal";
import { AuthModuleAttributes } from "../components/auth/AuthModuleAttributes";
import FakeAuthModule from "../components/auth/FakeAuthModule";
import FirebaseAuth from "../components/auth/FirebaseAuth";
import { FloatBottomMenu } from "../components/FloatBottomMenu";
import { SerieCard } from "../components/SerieCard";
import { ITab } from "../components/Tab";
import { TabsMenu } from "../components/TabsMenu";
import TopBar from "../components/TopBar";
import FirebaseAuthController, {
  AuthChangeEvent,
} from "../controllers/auth/FirebaseAuthController";
import FirebaseClient from "../controllers/db/FirebaseClient";
import IComponent from "../interfaces/Component";
import { IDbClient } from "../interfaces/DbClient";
import { IAuthController } from "../interfaces/IAuthController";
import { Category, Serie } from "../interfaces/Models";
import "../styles/main.scss";

export default class Main extends IComponent {
  private client: IDbClient;
  private auth: IAuthController;
  private app: FirebaseApp;

  // Categories
  private actualCategory: Category;

  //Components
  private floatBotMenu: FloatBottomMenu;
  private tabsMenu: TabsMenu;
  private addTabModal: AddCategoryModal;
  private seriesDiv: HTMLDivElement;
  private topBar: TopBar;
  private authModule: IComponent;
  private addSerieModal: AddSerieModal;

  constructor() {
    super();
    this.app = initializeApp(FirebaseKeys);
    this.auth = new FirebaseAuthController(this.app);

    //this.auth = new FakeAuth();

    this.authModule = new FirebaseAuth(this.auth as FirebaseAuthController);
    //this.authModule = new FakeAuthModule(this.auth);
    this.topBar = new TopBar(this.auth, this.authModule);
    this.client = new FirebaseClient(this.app);
    //this.client = new FakeClient();
    this.actualCategory = { name: "" };

    this.addTabModal = new AddCategoryModal(this.client);
    this.tabsMenu = new TabsMenu(this.addTabModal);

    this.seriesDiv = document.createElement("div");

    this.addSerieModal = new AddSerieModal();
    this.floatBotMenu = new FloatBottomMenu(this.addSerieModal);

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
    if (x.isSudo) {
      console.log("Logged");
      this.tabsMenu.showAddCategTab();
      this.authModule.setAttribute(
        AuthModuleAttributes.logged.name,
        AuthModuleAttributes.logged.yes
      );
      const categories = await this.client.getAllCategories();
      if (categories.length > 0) {
        this.actualCategory = categories[0];
        await this.updateTabs(categories);
        await this.updateSeries();
      }
      this.append(this.floatBotMenu, this.addSerieModal, this.addTabModal);
    } else {
      console.log("Not logged");
      this.authModule.setAttribute(
        AuthModuleAttributes.logged.name,
        AuthModuleAttributes.logged.no
      );
      this.tabsMenu.showAddCategTab(false);
      if (this.floatBotMenu.isConnected) this.floatBotMenu.remove();
      if (this.addSerieModal.isConnected) this.addSerieModal.remove();
      if (this.addTabModal.isConnected) this.addTabModal.remove();
    }
  };

  async connectedCallback(): Promise<void> {
    this.topBar.setAttribute("title", "Series List Next");
    this.seriesDiv.classList.add("series", "container");

    this.addTabModal.onCategoryAdded = async (categ) => {
      this.tabsMenu.addTab((await this.createTabs(categ))[0]);
    };

    this.addSerieModal.onSerieAdded = async (serie) => {
      if (this.actualCategory._id === undefined) {
        throw new Error("Category id is not defined");
      }
      const id = await this.client.addSerie(serie, this.actualCategory._id);
      this.seriesDiv.insertBefore(
        (await this.createCards(Object.assign(serie, { _id: id })))[0],
        this.seriesDiv.children.item(0)
      );
    };
    /*const categories = await this.client.getAllCategories();
    if (categories.length > 0) {
      this.actualCategory = categories[0];
      await this.updateTabs(categories);
      await this.updateSeries();
    }*/

    this.append(this.topBar, this.tabsMenu, this.seriesDiv);
  }

  /**
   * Creates cards from SeriesCard
   * @param series
   * @returns
   */
  async createCards(...series: Serie[]): Promise<SerieCard[]> {
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
  }

  async updateSeries() {
    console.log("Updating series with category:", this.actualCategory);
    if (this.actualCategory._id === undefined) {
      throw new Error("Error with category " + this.actualCategory);
    }

    const series = await this.client.getSeriesByCategoryId(
      this.actualCategory._id
    );

    this.seriesDiv.textContent = "";
    (await this.createCards.apply(this, series)).forEach((s) =>
      this.seriesDiv.append(s)
    );
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

window.customElements.define("sl-main", Main);
