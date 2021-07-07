import { FirebaseApp } from "firebase/app";
import FirebaseAuthController from "../../controllers/auth/FirebaseAuthController";
import IComponent from "../../interfaces/Component";

export default class FirebaseAuth extends IComponent {
  constructor(private readonly controller: FirebaseAuthController) {
    super();
  }

  connectedCallback() {
    const googleBtn = document.createElement("button");
    googleBtn.innerText = "Iniciar con Google";
    googleBtn.onclick = async () => {
      await this.controller.login();
    };
    this.append(googleBtn);
  }
}

window.customElements.define("sl-firebaseauth", FirebaseAuth);
