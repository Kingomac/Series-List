import { APP_MODE, AppModes } from "../../app.modes";
import Placeholders from "../../test/Placeholders";
import ModalView from "../interfaces/ModalView";
import { Category } from "../interfaces/Models";
export class AddCategoryModal extends ModalView {
  onSubmit?(categ: Category): void;

  private titleDiv: HTMLDivElement = document.createElement("div");
  private titleSpan: HTMLSpanElement = document.createElement("span");
  private closeBtn: HTMLButtonElement = document.createElement("button");
  private nameInput: HTMLInputElement = document.createElement("input");
  private submitBtn: HTMLButtonElement = document.createElement("button");

  constructor() {
    super();
  }

  async connectedCallback() {
    this.window.append(this.titleDiv, this.nameInput, this.submitBtn);
    this.titleDiv.append(this.titleSpan, this.closeBtn);

    this.nameInput.type = "text";

    this.titleSpan.innerText = "Añadir categoría";
    this.closeBtn.innerText = "❌";
    this.closeBtn.onclick = () => {
      this.remove();
    };

    this.submitBtn.innerText = "Añadir";
    this.submitBtn.onclick = async () => {
      console.log("Create category with name", this.nameInput.value);
      this.onSubmit!({
        name: this.nameInput.value,
        timestamp: new Date(),
      });
      this.remove();
    };
    await this.setRandomName();
  }

  private async setRandomName() {
    if (APP_MODE == AppModes.DEBUG) {
      const categ = await Placeholders.getRandomCategory();
      this.nameInput.value = categ.name;
    }
  }
}

window.customElements.define("sl-add-category-modal", AddCategoryModal);
