import { APP_MODE, AppModes } from "../../app.config";
import FakeAuth from "../../test/FakeAuth";
import { FakeClient } from "../../test/FakeClient";
import Placeholders from "../../test/Placeholders";
import IComponent from "../interfaces/Component";
import { IDbClient } from "../interfaces/DbClient";
import { Category } from "../interfaces/Models";
import { ITab } from "./Tab";

export class AddCategoryModal extends IComponent {
  /**
   * Element attributes
   * * visibility
   * @version 1.0
   */
  static get observedAttributes(): string[] {
    return ["visibility"];
  }

  onCategoryAdded?(categ: Category): void;

  private winDiv: HTMLDivElement;
  private titleDiv: HTMLDivElement;
  private titleSpan: HTMLSpanElement;
  private closeBtn: HTMLButtonElement;
  private nameInput: HTMLInputElement;
  private submitBtn: HTMLButtonElement;

  constructor(private client: IDbClient) {
    super();
    this.setAttribute(AddCategoryModal.observedAttributes[0], "hidden");
    this.winDiv = document.createElement("div");
    this.titleDiv = document.createElement("div");
    this.titleSpan = document.createElement("span");
    this.closeBtn = document.createElement("button");
    this.nameInput = document.createElement("input");
    this.submitBtn = document.createElement("button");
  }

  async connectedCallback() {
    this.append(this.winDiv);

    this.winDiv.append(this.titleDiv, this.nameInput, this.submitBtn);
    this.titleDiv.append(this.titleSpan, this.closeBtn);

    this.nameInput.type = "text";

    this.titleSpan.innerText = "Añadir categoría";
    this.closeBtn.innerText = "❌";
    this.closeBtn.onclick = () => {
      this.setAttribute(AddCategoryModal.observedAttributes[0], "hidden");
    };

    this.submitBtn.innerText = "Añadir";
    this.submitBtn.onclick = async () => {
      this.setAttribute(AddCategoryModal.observedAttributes[0], "hidden");
      console.log("Create category with name", this.nameInput.value);
      const id = await this.client.addCategory({ name: this.nameInput.value });
      this.onCategoryAdded!({
        _id: id,
        name: this.nameInput.value,
        timestamp: new Date(),
      });
      await this.setRandomName();
    };
    await this.setRandomName();
  }

  async setRandomName() {
    if (APP_MODE == AppModes.DEBUG) {
      const categ = await Placeholders.getRandomCategory();
      this.nameInput.value = categ.name;
    }
  }

  attributeChangedCallback(name: string, lastValue: any, newValue: any): void {
    if (name == AddCategoryModal.observedAttributes[0]) {
      this.style.visibility = newValue;
    }
  }
}

window.customElements.define("sl-add-category-modal", AddCategoryModal);
