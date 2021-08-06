import FirebaseAuthController from "../../controllers/auth/FirebaseAuthController";
import IComponent from "../../interfaces/Component";
import { AuthModuleAttributes } from "./AuthModuleAttributes";

export default class FirebaseAuth extends IComponent {
  static get observedAttributes() {
    return [AuthModuleAttributes.logged.name];
  }

  private btn = document.createElement("button");

  constructor(private readonly controller: FirebaseAuthController) {
    super();
    this.notLogged();
  }
  connectedCallback() {
    this.append(this.btn);
  }

  notLogged() {
    console.log("FirebaseAuthModule: not logged");
    this.btn.innerText = "Iniciar con Google";
    this.btn.onclick = async () => {
      await this.controller.login();
    };
    this.append(this.btn);
  }

  logged() {
    console.log("FirebaseAuthModule: logged");
    this.btn.innerText = "Cerrar sesión";
    this.btn.onclick = async () => {
      await this.controller.logout();
    };
    this.append(this.btn);
  }

  attributeChangedCallback(name: string, lastValue: string, newValue: string) {
    if (name == AuthModuleAttributes.logged.name) {
      if (newValue == AuthModuleAttributes.logged.yes) {
        this.logged();
      } else {
        this.notLogged();
      }
    }
  }
}

window.customElements.define("sl-firebaseauth", FirebaseAuth);
