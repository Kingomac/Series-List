import NavigationDrawer from "../components/NavigationDrawer";
import { IDbClient } from "../interfaces/DbClient";
import FirebaseClient from "../controllers/db/FirebaseClient";
import "../styles/ManageView.scss";
import { Route } from "../routes";
import View from "../interfaces/View";
import { AuthChangeEvent } from "../controllers/auth/FirebaseAuthController";
import AuthStatus from "../interfaces/AuthStatus";

export default class ManageView extends View {
  private dbClient: IDbClient;
  private navigatorDrawer: NavigationDrawer = new NavigationDrawer({
    hrefRoot: "/manage",
  });
  private viewDiv: HTMLDivElement = document.createElement("div");
  private viewPlaceholder: HTMLElement = document.createElement("div");

  constructor(x: {
    dbClient: IDbClient;
    changeView: (path: Route) => Promise<void>;
  }) {
    super();
    this.dbClient = x.dbClient;
  }

  connectedCallback() {
    this.navigatorDrawer.addItems(
      { name: "Backups", href: "/backups" },
      { name: "Migrations", href: "/migrations" }
    );
    this.navigatorDrawer.onItemClick = (x) => {
      console.log("Loading new manage view", x);
      this.updateView(x.href);
    };
    this.viewDiv.className = "manage-view";
    this.viewDiv.append(this.navigatorDrawer, this.viewPlaceholder);
  }

  authChangeEvent = async (x: AuthChangeEvent) => {
    if (x.status == AuthStatus.SUDO) {
      this.append(this.viewDiv);
    } else {
      this.viewDiv.remove();
    }
  };

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
