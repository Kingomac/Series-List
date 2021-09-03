import { initializeApp } from "firebase/app";
import { FIREBASE_KEYS } from "../app.config";
import ManageView from "./pages/ManageView";
import SeriesView from "./pages/SeriesView";
window.onload = () => {
  const app = document.querySelector("#app");
  const firebaseApp = initializeApp(FIREBASE_KEYS);
  if (app == null) {
    console.error("Page couldn't load 😥");
  } else {
    if (window.location.pathname.split("/").includes("manage")) {
      app.replaceWith(new ManageView({ app: firebaseApp }));
    } else {
      app.replaceWith(new SeriesView({ app: firebaseApp }));
    }
  }
};
