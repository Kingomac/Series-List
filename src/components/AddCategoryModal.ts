import AppModes from "../interfaces/AppModes";
import ModalView from "../interfaces/ModalView";
import { Category } from "../interfaces/Models";
import { APP_MODE } from "../../app.config";
////////////////////////////////////////////////////
import Placeholders from "../../test/Placeholders";
///////////////////////////////////////////////////

export class AddCategoryModal extends ModalView {
  onSubmit?(categ: Category): Promise<void>;

  private titleDiv: HTMLDivElement = document.createElement("div");
  private titleSpan: HTMLSpanElement = document.createElement("span");
  private closeBtn: HTMLButtonElement = document.createElement("button");
  private nameInput: HTMLInputElement = document.createElement("input");
  private submitBtn: HTMLButtonElement = document.createElement("button");

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
      separator2,
      this.submitBtn
    );
    this.titleDiv.append(this.titleSpan, this.closeBtn);
    this.titleDiv.className = "title";

    this.nameInput.type = "text";

    this.titleSpan.innerText = "Añadir categoría";
    this.closeBtn.className = "title-btn";
    this.closeBtn.innerText = "X";
    this.closeBtn.onclick = () => {
      this.remove();
    };

    this.submitBtn.innerText = "Añadir";
    this.submitBtn.onclick = async () => {
      console.log("Create category with name", this.nameInput.value);
      await this.onSubmit!({
        name: this.nameInput.value,
        timestamp: new Date(),
      });
      this.remove();
    };
    await this.setRandomName();
  }

  private async setRandomName() {
    if (APP_MODE == AppModes.DEBUG) {
      //const { default: Placeholders } = await import("../../test/Placeholders");
      const categ = await Placeholders.getRandomCategory();
      this.nameInput.value = categ.name;
    }
  }
}

window.customElements.define("sl-add-category-modal", AddCategoryModal);
