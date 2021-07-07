import IComponent from "../../interfaces/Component";
import { IAuthController } from "../../interfaces/IAuthController";
import { AuthModuleAttributes } from "./AuthModuleAttributes";

export default class FakeAuthModule extends IComponent {
  static get observedAttributes() {
    return [AuthModuleAttributes.logged.name];
  }

  constructor(private readonly auth: IAuthController) {
    super();
    this.setAttribute(
      AuthModuleAttributes.logged.name,
      AuthModuleAttributes.logged.no
    );
  }
  connectedCallback() {}

  logged() {
    const btn = document.createElement("button");
    btn.innerText = "Cerrar sesión";
    btn.onclick = () => {
      this.auth.logout();
    };
    this.append(btn);
  }

  notLogged() {
    const btn = document.createElement("button");
    btn.innerText = "Iniciar sesión";
    btn.onclick = () => {
      this.auth.login({ pass: "", url: "" });
    };
    this.append(btn);
  }

  attributeChangedCallback(name: string, lastValue: any, newValue: any) {
    if (name == AuthModuleAttributes.logged.name) {
      if (newValue == AuthModuleAttributes.logged.yes) {
        this.textContent = "";
        this.logged();
      } else {
        this.textContent = "";
        this.notLogged();
      }
    }
  }
}

window.customElements.define("sl-fakeauthmodule", FakeAuthModule);
