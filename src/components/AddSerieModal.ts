import IComponent from "../interfaces/Component";
import { IDbClient } from "../interfaces/DbClient";
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

  constructor(private client: IDbClient) {
    super();
    this.setAttribute(AddSerieModal.observedAttributes[0], "hidden");
    const winDiv = document.createElement("div");

    const nameInput = document.createElement("input");
    const altNameInput = document.createElement("input");
    const imgInput = document.createElement("input");
    const urlInput = document.createElement("input");

    const titleDiv = document.createElement("div");
    const titleSpan = document.createElement("span");
    const modalClose = document.createElement("button");

    const submitBtn = document.createElement("button");

    this.append(winDiv);
    winDiv.append(
      titleDiv,
      nameInput,
      altNameInput,
      imgInput,
      urlInput,
      submitBtn
    );
    titleDiv.append(titleSpan, modalClose);

    nameInput.type = "text";
    altNameInput.type = "text";
    imgInput.type = "text";
    urlInput.type = "text";

    nameInput.placeholder = "Nombre JP";
    altNameInput.placeholder = "Nombre EN";
    imgInput.placeholder = "Link imagen";
    urlInput.placeholder = "Url";

    titleSpan.innerText = "Añadir serie";
    modalClose.innerText = "❌";
    modalClose.onclick = () =>
      this.setAttribute(AddSerieModal.observedAttributes[0], "hidden");
    submitBtn.innerText = "Añadir";
    submitBtn.onclick = async () => {
      this.client.addSerie(
        {
          name: nameInput.value,
          nameAlt: altNameInput.value,
          chapter: 0,
          image: imgInput.value,
          url: urlInput.value,
        },
        ""
      );
    };
  }
  connectedCallback() {}

  attributeChangedCallback(name: string, lastValue: any, newValue: any): void {
    if (name == AddSerieModal.observedAttributes[0]) {
      this.style.visibility = newValue;
    }
  }
}

window.customElements.define("sl-add-serie-modal", AddSerieModal);
