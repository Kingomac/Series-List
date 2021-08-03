import { APP_MODE, AppModes } from "../../app.config";
import { FakeClient } from "../../test/FakeClient";
import Placeholders from "../../test/Placeholders";
import IComponent from "../interfaces/Component";
import { IDbClient } from "../interfaces/DbClient";
import { Serie } from "../interfaces/Models";
import "../styles/Modal.scss";

export class AddSerieModal extends IComponent {
  /**
   * Element attributes
   * * visibility
   * @version 1.0
   */
  static get observedAttributes(): string[] {
    return ["visibility"];
  }

  onSerieAdded?(serie: Serie): void;

  private winDiv = document.createElement("div");

  private nameInput = document.createElement("input");
  private altNameInput = document.createElement("input");
  private imgInput = document.createElement("input");
  private urlInput = document.createElement("input");

  private titleDiv = document.createElement("div");
  private titleSpan = document.createElement("span");
  private modalClose = document.createElement("button");

  private submitBtn = document.createElement("button");

  constructor() {
    super();
    this.setAttribute(AddSerieModal.observedAttributes[0], "hidden");
  }
  connectedCallback() {
    this.append(this.winDiv);
    this.winDiv.append(
      this.titleDiv,
      this.nameInput,
      this.altNameInput,
      this.imgInput,
      this.urlInput,
      this.submitBtn
    );
    this.titleDiv.append(this.titleSpan, this.modalClose);

    this.nameInput.type = "text";
    this.altNameInput.type = "text";
    this.imgInput.type = "text";
    this.urlInput.type = "text";

    this.nameInput.placeholder = "Nombre JP";
    this.altNameInput.placeholder = "Nombre EN";
    this.imgInput.placeholder = "Link imagen";
    this.urlInput.placeholder = "Url";

    this.titleSpan.innerText = "Añadir serie";
    this.modalClose.innerText = "❌";
    this.modalClose.onclick = () =>
      this.setAttribute(AddSerieModal.observedAttributes[0], "hidden");
    this.submitBtn.innerText = "Añadir";
    this.submitBtn.onclick = async () => {
      this.onSerieAdded!({
        name: this.nameInput.value,
        nameAlt: this.altNameInput.value,
        chapter: 0,
        image: this.imgInput.value,
        url: this.urlInput.value,
      });
      await this.clearInputs();
      await this.generateData();
    };
    this.generateData();
  }

  async clearInputs() {
    this.nameInput.value = "";
    this.altNameInput.value = "";
    this.imgInput.value = "";
    this.urlInput.value = "";
  }

  async generateData() {
    if (APP_MODE == AppModes.DEBUG) {
      const serie = await Placeholders.getRandomSerie();
      this.nameInput.value = serie.name;
      this.altNameInput.value = serie.nameAlt;
      this.imgInput.value = serie.image;
      this.urlInput.value = serie.url;
    }
  }

  attributeChangedCallback(name: string, lastValue: any, newValue: any): void {
    if (name == AddSerieModal.observedAttributes[0]) {
      this.style.visibility = newValue;
    }
  }
}

window.customElements.define("sl-add-serie-modal", AddSerieModal);
