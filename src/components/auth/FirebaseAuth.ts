import FirebaseAuthController from "../../controllers/auth/FirebaseAuthController";
import AuthStatus from "../../interfaces/AuthStatus";
import IComponent from "../../interfaces/Component";

export default class FirebaseAuth extends IComponent {
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

  setState(newState: AuthStatus) {
    if (newState == AuthStatus.SUDO) this.logged();
    else this.notLogged();
  }
}

window.customElements.define("sl-firebaseauth", FirebaseAuth);
