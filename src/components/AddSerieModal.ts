import { APP_MODE, AppModes } from "../../app.modes";
import Placeholders from "../../test/Placeholders";
import ModalView from "../interfaces/ModalView";
import { Serie } from "../interfaces/Models";
import "../styles/Modal.scss";

export class AddSerieModal extends ModalView {
  onSubmit?(serie: Serie): void;

  private nameInput = document.createElement("input");
  private imgInput = document.createElement("input");
  private urlInput = document.createElement("input");

  private titleDiv = document.createElement("div");
  private titleSpan = document.createElement("span");
  private modalClose = document.createElement("button");

  private submitBtn = document.createElement("button");

  constructor() {
    super();
  }

  async connectedCallback() {
    this.window.append(
      this.titleDiv,
      this.nameInput,
      this.imgInput,
      this.urlInput,
      this.submitBtn
    );
    this.titleDiv.append(this.titleSpan, this.modalClose);

    this.nameInput.type = "text";
    this.imgInput.type = "text";
    this.urlInput.type = "text";

    this.nameInput.placeholder = "Nombre";
    this.imgInput.placeholder = "Link imagen";
    this.urlInput.placeholder = "Url";

    this.titleSpan.innerText = "Añadir serie";
    this.modalClose.innerText = "❌";
    this.modalClose.onclick = () => this.remove();
    this.submitBtn.innerText = "Añadir";
    this.submitBtn.onclick = async () => {
      this.onSubmit!({
        name: this.nameInput.value,
        chapter: 0,
        image: this.imgInput.value,
        url: this.urlInput.value,
      });
      await this.clearInputs();
      await this.generateData();
    };
    if (APP_MODE == AppModes.DEBUG) {
      this.submitBtn.onauxclick = async () => {
        for (let i = 0; i < 14; i++) {
          this.onSubmit!(await Placeholders.getRandomSerie());
        }
      };
    }
    this.generateData();
  }
  async clearInputs() {
    this.nameInput.value = "";
    this.imgInput.value = "";
    this.urlInput.value = "";
  }

  async generateData() {
    if (APP_MODE == AppModes.DEBUG) {
      const serie = await Placeholders.getRandomSerie();
      this.nameInput.value = serie.name;
      this.imgInput.value = serie.image;
      this.urlInput.value = serie.url;
    }
  }
}

window.customElements.define("sl-add-serie-modal", AddSerieModal);
