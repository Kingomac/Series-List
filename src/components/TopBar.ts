import { AuthChangeEvent } from "../controllers/auth/FirebaseAuthController";
import AuthStatus from "../interfaces/AuthStatus";
import IComponent from "../interfaces/Component";
import { IAuthController } from "../interfaces/IAuthController";
import { Route } from "../routes";
import "../styles/TopBar.scss";

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
  }

  attributeChangedCallback(name: string, lastValue: any, newValue: any) {
    if (name == TopBar.attrTitle) {
      this.titleSpan.innerText = newValue;
    }
  }

  authChangeEvent = async (state: AuthChangeEvent) => {
    console.log("Topbar auth change");
    if (state.status == AuthStatus.SUDO) {
      this.fujiwara.onclick = () => {
        if (!window.location.pathname.split("/").includes("manage")) {
          window.history.pushState(null, "", "/manage");
          this.x.changeView(Route.MANAGE);
        }
      };
      this.titleSpan.onclick = () => {
        if (window.location.pathname.split("/").includes("manage")) {
          window.history.pushState(null, "", "/");
          this.x.changeView(Route.SERIES);
        }
      };
    } else {
      this.fujiwara.onclick = () => {};
      this.titleSpan.onclick = () => {};
    }
  };
}

window.customElements.define("sl-topbar", TopBar);
