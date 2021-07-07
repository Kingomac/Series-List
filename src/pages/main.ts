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
import FirebaseAuthController from "../controllers/auth/FirebaseAuthController";
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
  private categories: Category[];

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
    this.tabsMenu = new TabsMenu(this.addTabModal, this.auth);
    this.tabsMenu.onTabsClick = async (tab: ITab) => {
      this.actualCategory = tab as Category;
      if (this.actualCategory._id == undefined)
        throw new Error(
          "Category " + this.actualCategory.name + " id is undefined"
        );
      await this.updateSeries();
    };

    this.seriesDiv = document.createElement("div");

    this.categories = [];
    this.addSerieModal = new AddSerieModal(this.client);
    this.floatBotMenu = new FloatBottomMenu(this.addSerieModal);
  }

  async connectedCallback(): Promise<void> {
    this.topBar.setAttribute("title", "Series List Next");
    this.seriesDiv.classList.add("series", "container");

    this.client.onInitialize = async () => {
      this.categories = await this.client.getAllCategories();
      if (this.categories.length > 0) {
        this.actualCategory = this.categories[0];
        await this.updateTabs();
      }

      this.addTabModal.onCategoryAdded = async (tab: ITab) => {
        console.log("category added:", tab);
        await this.tabsMenu.addTab(tab);
      };
    };

    this.auth.onAuthChange = async () => {
      console.log("Auth changed!");
      if (this.auth.isSudo()) {
        console.log("Logged");
        this.tabsMenu.showAddCategTab();
        this.authModule.setAttribute(
          AuthModuleAttributes.logged.name,
          AuthModuleAttributes.logged.yes
        );
        await this.updateSeries();
        this.append(this.floatBotMenu, this.addSerieModal, this.addTabModal);
      } else {
        console.log("Not logged");
        this.authModule.setAttribute(
          AuthModuleAttributes.logged.name,
          AuthModuleAttributes.logged.no
        );
        this.tabsMenu.showAddCategTab(false);
        this.floatBotMenu.remove();
        this.addSerieModal.remove();
        this.addTabModal.remove();
      }
    };

    this.append(this.topBar, this.tabsMenu, this.seriesDiv);
  }

  async createCards(series: Serie[]): Promise<SerieCard[]> {
    return series.map(
      (s: Serie) => new SerieCard(s, this.actualCategory._id || "", this.auth)
    );
  }

  async createTabs(categs: Category[]): Promise<ITab[]> {
    return categs.map((c) => Object.assign(c, { url: "/" + c.name }));
  }

  async updateTabs() {
    await this.tabsMenu.clearTabs();
    await this.tabsMenu.addAllTab(await this.createTabs(this.categories));
  }

  async updateSeries() {
    if (this.actualCategory._id === undefined) {
      console.log("No categories exist");
      return;
    }

    const series = await this.client.getSeriesByCategoryId(
      this.actualCategory._id
    );

    this.seriesDiv.textContent = "";
    (await this.createCards(series)).forEach((s) => this.seriesDiv.append(s));
  }
}

window.customElements.define("sl-main", Main);
