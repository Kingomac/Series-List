import { Serie } from "../interfaces/Models";
import "../styles/Modal.scss";
import ModalView from "../interfaces/ModalView";

export default class EditSerieModal extends ModalView {
  onSubmit?(serie: Serie): void;

  private nameInput = document.createElement("input");
  private altNameInput = document.createElement("input");
  private imgInput = document.createElement("input");
  private urlInput = document.createElement("input");
  private chapterInput = document.createElement("input");

  private titleDiv = document.createElement("div");
  private titleSpan = document.createElement("span");
  private modalClose = document.createElement("button");

  private submitBtn = document.createElement("button");

  constructor(private serie: Serie) {
    super();
    console.log("Editing serie:", serie);
  }
  connectedCallback() {
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
      this.chapterInput,
      separator2,
      this.submitBtn
    );
    this.titleDiv.append(this.titleSpan, this.modalClose);

    this.titleDiv.className = "title";

    this.nameInput.type = "text";
    this.altNameInput.type = "text";
    this.imgInput.type = "text";
    this.urlInput.type = "text";
    this.chapterInput.type = "number";

    this.nameInput.placeholder = "Nombre";
    this.altNameInput.placeholder = "Nombre alternativo";
    this.imgInput.placeholder = "Link imagen";
    this.urlInput.placeholder = "Url";
    this.chapterInput.placeholder = "Capítulo";

    this.titleSpan.innerText = "Editar serie";
    this.modalClose.innerText = "X";
    this.modalClose.className = "title-btn";
    this.modalClose.onclick = () => {
      this.disconnectedCallback!();
      this.remove();
    };
    this.submitBtn.innerText = "Guardar";
    this.submitBtn.onclick = async () => {
      this.onSubmit!({
        _id: this.serie._id,
        name: this.nameInput.value,
        nameAlt: this.altNameInput.value,
        chapter: this.chapterInput.valueAsNumber,
        image: this.imgInput.value,
        url: this.urlInput.value,
        timestamp: new Date(),
      });
      this.disconnectedCallback!();
      this.remove();
    };

    this.nameInput.value = this.serie.name;
    this.altNameInput.value = this.serie.nameAlt;
    this.imgInput.value = this.serie.image;
    this.urlInput.value = this.serie.url;
    this.chapterInput.value = this.serie.chapter.toString();
  }
}

window.customElements.define("sl-edit-serie-modal", EditSerieModal);
