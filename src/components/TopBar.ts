import IComponent from "../interfaces/Component";
import { IAuthController } from "../interfaces/IAuthController";
import { Route } from "../routes";
import "../styles/TopBar.scss";
import { AuthModuleAttributes } from "./auth/AuthModuleAttributes";

export default class TopBar extends IComponent {
  private static attrTitle: string = "title";
  private titleSpan: HTMLSpanElement = document.createElement("span");
  private fujiwara: HTMLImageElement = document.createElement("img");

  static get observedAttributes() {
    return ["title"];
  }

  constructor(
    private x: {
      authModule: IComponent;
      changeView: (path: Route) => Promise<void>;
    }
  ) {
    super();
  }

  connectedCallback(): void {
    this.append(this.fujiwara, this.titleSpan, this.x.authModule);
    this.titleSpan.innerText = this.getAttribute("title") || "";
    this.fujiwara.src =
      "https://firebasestorage.googleapis.com/v0/b/memeshare-a3107.appspot.com/o/fujiwara.webp?alt=media&token=33c26161-35ea-4d4e-b72c-866b813a1313";
    this.fujiwara.alt = "Fujiwara Chika detective";
    this.fujiwara.onclick = () => {
      if (
        this.x.authModule.getAttribute(AuthModuleAttributes.logged.name) ===
          AuthModuleAttributes.logged.yes &&
        !window.location.pathname.split("/").includes("manage")
      ) {
        window.history.pushState(null, "", "/manage");
        this.x.changeView(Route.MANAGE);
      }
    };
    this.titleSpan.onclick = () => {
      if (
        this.x.authModule.getAttribute(AuthModuleAttributes.logged.name) ===
          AuthModuleAttributes.logged.yes &&
        window.location.pathname.split("/").includes("manage")
      ) {
        window.history.pushState(null, "", "/");
        this.x.changeView(Route.SERIES);
      }
    };
  }

  attributeChangedCallback(name: string, lastValue: any, newValue: any) {
    if (name == TopBar.attrTitle) {
      this.titleSpan.innerText = newValue;
    }
  }
}

window.customElements.define("sl-topbar", TopBar);
