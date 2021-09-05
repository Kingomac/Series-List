import IComponent from "../interfaces/Component";
import { IAuthController } from "../interfaces/IAuthController";
import "../styles/TopBar.scss";
import { AuthModuleAttributes } from "./auth/AuthModuleAttributes";

export default class TopBar extends IComponent {
  private static attrTitle: string = "title";
  private titleSpan: HTMLSpanElement = document.createElement("span");
  private fujiwara: HTMLImageElement = document.createElement("img");

  static get observedAttributes() {
    return ["title"];
  }

  constructor(private authModule: IComponent) {
    super();
  }

  connectedCallback(): void {
    this.append(this.fujiwara, this.titleSpan, this.authModule);
    this.titleSpan.innerText = this.getAttribute("title") || "";
    this.fujiwara.src =
      "https://firebasestorage.googleapis.com/v0/b/memeshare-a3107.appspot.com/o/fujiwara.webp?alt=media&token=33c26161-35ea-4d4e-b72c-866b813a1313";
    this.fujiwara.onclick = () => {
      if (
        this.authModule.getAttribute(AuthModuleAttributes.logged.name) ===
          AuthModuleAttributes.logged.yes &&
        !window.location.pathname.split("/").includes("manage")
      )
        window.location.pathname = "/manage";
    };
    this.titleSpan.onclick = () => {
      if (
        this.authModule.getAttribute(AuthModuleAttributes.logged.name) ===
          AuthModuleAttributes.logged.yes &&
        window.location.pathname.split("/").includes("manage")
      )
        window.location.pathname = "/";
    };
  }

  attributeChangedCallback(name: string, lastValue: any, newValue: any) {
    if (name == TopBar.attrTitle) {
      this.titleSpan.innerText = newValue;
    }
  }
}

window.customElements.define("sl-topbar", TopBar);
