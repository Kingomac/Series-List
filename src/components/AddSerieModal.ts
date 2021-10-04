import AppModes from "../interfaces/AppModes";
import ModalView from "../interfaces/ModalView";
import { Serie } from "../interfaces/Models";
import "../styles/Modal.scss";
import { APP_MODE } from "../../app.config";

export class AddSerieModal extends ModalView {
  onSubmit?(serie: Serie): Promise<void>;

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
  }

  async connectedCallback() {
    const separator = document.createElement("div");
    separator.className = "separator";
    const separator2 = document.createElement("div");
    separator2.className = "separator";
    this.window.append(
      this.titleDiv,
      separator,
      this.nameInput,
      this.altNameInput,
      this.imgInput,
      this.urlInput,
      separator2,
      this.submitBtn
    );

    this.titleDiv.append(this.titleSpan, this.modalClose);

    this.titleDiv.className = "title";

    this.nameInput.type = "text";
    this.altNameInput.type = "text";
    this.imgInput.type = "text";
    this.urlInput.type = "text";

    this.nameInput.placeholder = "Nombre";
    this.altNameInput.placeholder = "Nombre alternativo";
    this.imgInput.placeholder = "Link imagen";
    this.urlInput.placeholder = "Url";

    this.titleSpan.innerText = "Añadir serie";
    this.modalClose.className = "title-btn";
    this.modalClose.innerText = "X";
    this.modalClose.onclick = () => this.remove();
    this.submitBtn.innerText = "Añadir";
    this.submitBtn.onclick = async () => {
      const { runLoading } = await import("./RunLoading");
      await runLoading(async () => {
        await this.onSubmit!({
          name: this.nameInput.value,
          nameAlt: this.altNameInput.value,
          chapter: 0,
          image: this.imgInput.value,
          url: this.urlInput.value,
        });
      }, this.submitBtn);
      await this.clearInputs();
      await this.generateData();
    };
    if (APP_MODE == AppModes.DEBUG) {
      this.submitBtn.onauxclick = async () => {
        const { default: Placeholders } = await import(
          "../../test/Placeholders"
        );
        const { runLoading } = await import("./RunLoading");
        await runLoading(async () => {
          for (let i = 0; i < 14; i++) {
            const s = await Placeholders.getRandomSerie();
            delete s._id, s.timestamp;
            await this.onSubmit!(s);
          }
        }, this.submitBtn);
      };
    }
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
      const { default: Placeholders } = await import("../../test/Placeholders");
      const serie = await Placeholders.getRandomSerie();
      this.nameInput.value = serie.name;
      this.altNameInput.value = serie.nameAlt;
      this.imgInput.value = serie.image;
      this.urlInput.value = serie.url;
    }
  }
}

window.customElements.define("sl-add-serie-modal", AddSerieModal);
