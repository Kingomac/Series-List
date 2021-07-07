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

  onCategoryAdded?(tab: ITab): void;

  constructor(private client: IDbClient) {
    super();
    this.setAttribute(AddCategoryModal.observedAttributes[0], "hidden");
    const winDiv = document.createElement("div");
    const titleDiv = document.createElement("div");
    const titleSpan = document.createElement("span");
    const closeBtn = document.createElement("button");
    const nameInput = document.createElement("input");
    const submitBtn = document.createElement("button");

    this.append(winDiv);

    winDiv.append(titleDiv, nameInput, submitBtn);
    titleDiv.append(titleSpan, closeBtn);

    nameInput.type = "text";

    titleSpan.innerText = "Añadir categoría";
    closeBtn.innerText = "❌";
    closeBtn.onclick = () => {
      this.setAttribute(AddCategoryModal.observedAttributes[0], "hidden");
    };

    submitBtn.innerText = "Añadir";
    submitBtn.onclick = async () => {
      this.setAttribute(AddCategoryModal.observedAttributes[0], "hidden");
      console.log("Create category with name", nameInput.value);
      await this.client.addCategory({ name: nameInput.value });
      //nameInput.value = "";
      //const categ = await this.client.getLastCategory();
      //this.onCategoryAdded!(Object.assign(categ, { url: "/" + categ.name }));
    };
  }

  connectedCallback() {}

  attributeChangedCallback(name: string, lastValue: any, newValue: any): void {
    if (name == AddCategoryModal.observedAttributes[0]) {
      this.style.visibility = newValue;
    }
  }
}

window.customElements.define("sl-add-category-modal", AddCategoryModal);
