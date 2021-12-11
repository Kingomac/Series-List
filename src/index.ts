import { initializeApp } from "firebase/app";
import { FIREBASE_KEYS } from "../app.config";
import SeriesView from "./pages/SeriesView";
import { Route } from "./routes";
window.onload = async () => {
  const app = document.querySelector("#app");
  const firebaseApp = initializeApp(FIREBASE_KEYS);

  async function changeView(path: Route) {
    if (app == null) {
      throw new Error("Page couldn't load 😥");
    }
    window.history.pushState(path, "", null);
    switch (path) {
      case Route.SERIES:
        console.time("Loading ManageView");
        const { default: SeriesView } = await import("./pages/SeriesView");
        app.replaceWith(new SeriesView({ app: firebaseApp, changeView }));
        console.timeEnd("Loading ManageView");
        break;
      case Route.MANAGE:
        console.time("Loading ManageView");
        const { default: ManageView } = await import("./pages/ManageView");
        app.replaceWith(new ManageView({ app: firebaseApp, changeView }));
        console.timeEnd("Loading ManageView");
        break;
    }
  }

  console.log("Initial pathname:", window.location.pathname);
  if (window.location.pathname == "") {
    console.log("Initial view: Route.SERIES");
    await changeView(Route.SERIES);
  } else if (window.location.pathname == "/manage") {
    console.log("Initial view: Route.MANAGE");
    await changeView(Route.MANAGE);
  } else {
    console.log("Initial view: Route.SERIES");
    await changeView(Route.SERIES);
  }
};
