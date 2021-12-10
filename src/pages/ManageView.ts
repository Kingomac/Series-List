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
import "../styles/main.scss";
import "../styles/ManageView.scss";
import { Route } from "../routes";

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

  constructor(x: { app: FirebaseApp, changeView: (path: Route) => Promise<void>  }) {
    super();
    this.app = x.app;
    this.auth = new FirebaseAuthController(this.app);
    this.authModule = new FirebaseAuth(this.auth);
    this.topBar = new TopBar({ authModule: this.authModule, changeView: x.changeView } );
    this.dbClient = new FirebaseClient(this.app);
  }

  connectedCallback() {
    this.append(this.topBar);
    this.navigatorDrawer.addItems(
      { name: "Backups", href: "/backups" },
      { name: "Migrations", href: "/migrations" }
    );
    this.navigatorDrawer.onItemClick = (x) => {
      console.log("Loading new manage view", x);
      this.updateView(x.href);
    };
    this.auth.onAuthChange = async (x) => {
      x.status === AuthStatus.SUDO || x.status === AuthStatus.SIGNED
        ? this.authModule.setAttribute("logged", "yes")
        : this.authModule.setAttribute("logged", "no");
      console.log("Auth changed!! =>", AuthStatus[x.status].toString());
      if (x.status === AuthStatus.SUDO) {
        this.append(this.viewDiv);
        await this.updateView(window.location.pathname.replace("/manage", ""));
      } else {
        this.viewDiv.remove();
      }
    };
    this.viewDiv.className = "manage-view";
    this.viewDiv.append(this.navigatorDrawer, this.viewPlaceholder);
    this.topBar.setAttribute("title", APP_NAME);
  }

  async updateView(path: string) {
    console.log("Updating view for", `"${path}"`);
    let view: HTMLElement;
    switch (path) {
      case "/backups":
        const { default: BackupsView } = await import("./manage/BackupsView");
        const { default: BackupController } = await import(
          "../controllers/BackupController"
        );
        view = new BackupsView(new BackupController(this.dbClient));
        break;
      case "/migrations":
        const { default: MigrationsView } = await import(
          "./manage/MigrationsView"
        );
        const { migrateOld } = await import(
          "../controllers/db/FirebaseMigrations"
        );
        view = new MigrationsView({
          fromOldMigration: async () => {
            if (!confirm("YOU KNOW I GOT I BANBAN BLOW YOUR MINDDDDD")) return;
            if (this.dbClient instanceof FirebaseClient)
              await migrateOld({ client: this.dbClient as FirebaseClient });
            else alert("This action requires a Firebase Db");
          },
        });
        break;
      default:
        const placeholder = document.createElement("div");
        placeholder.innerText = "Elige una opción del panel";
        view = placeholder;
    }
    console.log("New view", view);
    view.className = "view";
    this.viewPlaceholder.replaceWith(view);
    this.viewPlaceholder = view;
  }
}

window.customElements.define("sl-manage", ManageView);
