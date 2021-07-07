import WSAuthController from "../../controllers/auth/WSAuthController";
import IComponent from "../../interfaces/Component";
import "../styles/AuthModule.scss";

export class WSAuthModule extends IComponent {
  static readonly URL_STORE: string = "lastUrl";

  static get observedAttributes(): string[] {
    return ["logged"];
  }

  constructor(private auth: WSAuthController) {
    super();
  }

  connectedCallback() {
    this.setAttribute("logged", "no");
  }

  logged(): void {
    const disconBtn: HTMLButtonElement = document.createElement("button");
    disconBtn.innerText = "Desconectar";
    disconBtn.onclick = () => {
      this.auth.logout();
    };
    this.append(disconBtn);
  }

  notLogged(): void {
    const urlInput: HTMLInputElement = document.createElement("input");
    const passInput: HTMLInputElement = document.createElement("input");
    const submitBtn: HTMLButtonElement = document.createElement("button");

    urlInput.type = "text";
    urlInput.placeholder = "Url";
    passInput.type = "password";
    passInput.placeholder = "Password";
    submitBtn.innerText = "Iniciar";

    urlInput.value = window.localStorage.getItem(WSAuthModule.URL_STORE) || "";

    submitBtn.onclick = () => {
      this.auth.login({
        url: urlInput.value,
        pass: passInput.value,
      });
      window.localStorage.setItem(WSAuthModule.URL_STORE, urlInput.value);
    };

    this.append(urlInput, passInput, submitBtn);
  }

  attributeChangedCallback(name: string, lastValue: any, newValue: any): void {
    console.log("attribute:", name);
    if (name == WSAuthModule.observedAttributes[0]) {
      if (newValue == "yes") {
        this.textContent = "";
        this.logged();
      } else {
        this.textContent = "";
        this.notLogged();
      }
    }
  }
}

window.customElements.define("sl-wsauth", WSAuthModule);
