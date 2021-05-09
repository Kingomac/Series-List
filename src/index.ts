import Main from "./pages/main";
window.onload = () => {
  const app = document.querySelector("#app");
  if (app == null) {
    console.error("Page couldn't load 😥");
  } else {
    app.replaceWith(new Main());
  }
};
