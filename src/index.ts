import { initializeApp } from "firebase/app";
import { APP_NAME, FIREBASE_KEYS } from "../app.config";
import FirebaseAuth from "./components/auth/FirebaseAuth";
import TopBar from "./components/TopBar";
import FirebaseAuthController, {
  AuthChangeEvent,
} from "./controllers/auth/FirebaseAuthController";
import FirebaseClient from "./controllers/db/FirebaseClient";
import AuthStatus from "./interfaces/AuthStatus";
import { IDbClient } from "./interfaces/DbClient";
import { IAuthController } from "./interfaces/IAuthController";
import { Route } from "./routes";
import View from "./interfaces/View";
import { registerSW } from "virtual:pwa-register";

import "./styles/main.scss";
window.onload = async () => {
  /*document.oncontextmenu = (ev) => {
    console.log(ev.target);
  };*/
  if ("serviceWorker" in navigator) {
    /*navigator.serviceWorker.register(
      new URL("./service-worker.ts", import.meta.url),
      { type: "module" }
    );*/

    registerSW();
  }

  const main = document.querySelector("main");
  if (main == null) throw new Error("Main not found");
  const appDiv = document.createElement("div");
  appDiv.id = "app";
  let app: View | null;
  const firebaseApp = initializeApp(FIREBASE_KEYS);
  const dbClient: IDbClient = new FirebaseClient(firebaseApp);
  const authController: IAuthController = new FirebaseAuthController(
    firebaseApp
  );
  const authModule: FirebaseAuth = new FirebaseAuth(
    authController as FirebaseAuthController
  );

  async function changeView(path: Route) {
    if (app != null) app.remove();
    if (main == null) throw new Error("Page couldn't load");
    switch (path) {
      case Route.SERIES:
        console.time("Loading SeriesView");
        const { default: SeriesView } = await import("./pages/SeriesView");
        const newSeriesView = new SeriesView({
          dbClient,
          changeView,
        });
        appDiv.append(newSeriesView);
        app = newSeriesView;
        console.timeEnd("Loading SeriesView");
        break;
      case Route.MANAGE:
        console.time("Loading ManageView");
        const { default: ManageView } = await import("./pages/ManageView");
        const newManageView = new ManageView({
          dbClient,
          changeView,
        });
        appDiv.append(newManageView);
        app = newManageView;
        console.timeEnd("Loading ManageView");
        break;
    }

    app.authChangeEvent({ status: authController.getStatus() });
  }

  const topBar = new TopBar({
    authModule: authModule,
    changeView: changeView,
  });

  authController.onAuthChange = async (x: AuthChangeEvent) => {
    authModule.setState(x.status);
    console.log("Auth changed!! =>", AuthStatus[x.status].toString());
    app?.authChangeEvent(x);
    topBar.authChangeEvent!(x);
  };

  console.log("Initial pathname:", window.location.pathname);
  if (window.location.pathname == "") {
    console.log("Initial view: Route.SERIES");
    await changeView(Route.SERIES);
  } else if (window.location.pathname.startsWith("/manage")) {
    console.log("Initial view: Route.MANAGE");
    await changeView(Route.MANAGE);
  } else {
    console.log("Initial view: Route.SERIES");
    await changeView(Route.SERIES);
  }

  topBar.setAttribute("title", APP_NAME);

  main.append(topBar, appDiv);
};
