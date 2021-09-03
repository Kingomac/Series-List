import IComponent from "../interfaces/Component";
import TopBar from "../components/TopBar";
import FirebaseAuth from "../components/auth/FirebaseAuth";
import FirebaseAuthController from "../controllers/auth/FirebaseAuthController";
import { FirebaseApp } from "firebase/app";
import { APP_NAME } from "../../app.config";
import NavigationDrawer from "../components/NavigationDrawer";
import AuthStatus from "../interfaces/AuthStatus";
import { IAuthController } from "../interfaces/IAuthController";
import { IDbClient } from "../interfaces/DbClient";
import FirebaseClient from "../controllers/db/FirebaseClient";
import BackupsView from "./manage/BackupsView";
import BackupController from "../controllers/BackupController";
import "../styles/ManageView.scss";

export default class ManageView extends IComponent {
  private app: FirebaseApp;
  private auth: FirebaseAuthController;
  private authModule: FirebaseAuth;
  private dbClient: IDbClient;
  private topBar: TopBar;
  private navigatorDrawer: NavigationDrawer = new NavigationDrawer({
    hrefRoot: "/manage",
  });
  private viewDiv: HTMLDivElement = document.createElement("div");
  private viewPlaceholder: HTMLElement = document.createElement("div");

  constructor(x: { app?: FirebaseApp }) {
    super();
    if (x.app === undefined) throw new Error("Firebase app is undefined");
    this.app = x.app;
    this.auth = new FirebaseAuthController(this.app);
    this.authModule = new FirebaseAuth(this.auth);
    this.topBar = new TopBar(this.authModule);
    this.dbClient = new FirebaseClient(this.app);
  }

  connectedCallback() {
    this.append(this.topBar);
    this.navigatorDrawer.addItems({ name: "Backups", href: "/backups" });
    this.navigatorDrawer.onItemClick = (x) => {
      console.log("Loading new manage view", x);
      this.updateView(x.href);
    };
    this.auth.onAuthChange = (x) => {
      x.status === AuthStatus.SUDO || x.status === AuthStatus.SIGNED
        ? this.authModule.setAttribute("logged", "yes")
        : this.authModule.setAttribute("logged", "no");
      console.log("Auth changed!! =>", AuthStatus[x.status].toString());
      if (x.status === AuthStatus.SUDO) {
        this.append(this.viewDiv);
        this.updateView(window.location.pathname.replace("/manage", ""));
      } else {
        this.viewDiv.remove();
      }
    };
    this.viewDiv.className = "manage-view";
    this.viewDiv.append(this.navigatorDrawer, this.viewPlaceholder);
    this.topBar.setAttribute("title", APP_NAME);
  }

  updateView(path: string) {
    let view: HTMLElement;
    switch (path) {
      case "/backups":
        view = new BackupsView(new BackupController(this.dbClient));
        break;
      default:
        const placeholder = document.createElement("div");
        placeholder.innerText = "Elige una opción del panel";
        view = placeholder;
    }
    console.log("New view", view);
    this.viewPlaceholder.textContent = "";
    this.viewPlaceholder.append(view);
  }
}

window.customElements.define("sl-manage", ManageView);
