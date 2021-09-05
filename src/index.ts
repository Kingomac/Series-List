import { initializeApp } from "firebase/app";
import { FIREBASE_KEYS } from "../app.config";
window.onload = async () => {
  const app = document.querySelector("#app");
  const firebaseApp = initializeApp(FIREBASE_KEYS);
  if (app == null) {
    console.error("Page couldn't load 😥");
  } else {
    if (window.location.pathname.split("/").includes("manage")) {
      console.time("Loading ManageView");
      const { default: ManageView } = await import("./pages/ManageView");
      app.replaceWith(new ManageView({ app: firebaseApp }));
      console.timeEnd("Loading ManageView");
    } else {
      console.time("Loading SeriesView");
      const { default: SeriesView } = await import("./pages/SeriesView");
      app.replaceWith(new SeriesView({ app: firebaseApp }));
      console.timeEnd("Loading SeriesView");
    }
  }
};
