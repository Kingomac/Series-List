import { initializeApp } from "firebase/app";
import { FIREBASE_KEYS } from "../app.config";
import FirebaseAuthController from "./controllers/auth/FirebaseAuthController";
import FirebaseClient from "./controllers/db/FirebaseClient";
import { IDbClient } from "./interfaces/DbClient";
import { IAuthController } from "./interfaces/IAuthController";
import { Route } from "./routes";
import "./styles/main.scss";
window.onload = async () => {
  let app = document.querySelector("#app");
  const firebaseApp = initializeApp(FIREBASE_KEYS);
  const dbClient: IDbClient = new FirebaseClient(firebaseApp);
  const authController: IAuthController = new FirebaseAuthController(
    firebaseApp
  );

  async function changeView(path: Route) {
    if (app == null) {
      throw new Error("Page couldn't load 😥");
    }
    //window.history.pushState(null, "", path + inpath);
    switch (path) {
      case Route.SERIES:
        console.time("Loading ManageView");
        const { default: SeriesView } = await import("./pages/SeriesView");
        const newSeriesView = new SeriesView({
          authController,
          dbClient,
          changeView,
        });
        app.replaceWith(newSeriesView);
        app = newSeriesView;
        console.timeEnd("Loading ManageView");
        break;
      case Route.MANAGE:
        console.time("Loading ManageView");
        const { default: ManageView } = await import("./pages/ManageView");
        const newManageView = new ManageView({
          authController,
          dbClient,
          changeView,
        });
        app.replaceWith(newManageView);
        app = newManageView;
        console.timeEnd("Loading ManageView");
        break;
    }
  }

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
};
