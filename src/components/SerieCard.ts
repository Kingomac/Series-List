import WSAuthController from "../controllers/auth/WSAuthController";
import IComponent from "../interfaces/Component";
import { IAuthController } from "../interfaces/IAuthController";
import { Category, Serie } from "../interfaces/Models";
import "../styles/SerieCard.scss";

export class SerieCard extends IComponent {
  constructor(
    private serie: Serie,
    private categId: string,
    private authController: IAuthController
  ) {
    super();
  }
  connectedCallback(): void {
    const img = document.createElement("img");
    const title = document.createElement("span");
    const chapter = document.createElement("i");

    img.src = this.serie.image;
    title.innerText = this.serie.name;
    chapter.innerText = "Capítulo: ".concat(this.serie.chapter.toString());

    this.append(img, title, chapter);

    if (this.authController.isSudo()) {
      this.style.height = "475px";
      const actions = document.createElement("div");
      actions.classList.add("card", "actions");
      this.append(actions);

      const addChapterBtn = document.createElement("button");
      const lessChapterBtn = document.createElement("button");
      const editBtn = document.createElement("button");
      const deleteBtn = document.createElement("button");
      const moveBtn = document.createElement("button");

      addChapterBtn.innerText = "▶";
      lessChapterBtn.innerText = "◀";
      editBtn.innerText = "✏";
      deleteBtn.innerText = "🗑";

      moveBtn.innerText = "M";

      actions.append(
        lessChapterBtn,
        addChapterBtn,
        editBtn,
        deleteBtn,
        moveBtn
      );

      addChapterBtn.onclick = () => {
        this.serie.chapter++;
        chapter.innerText = "Capítulo: ".concat(this.serie.chapter.toString());
      };
      lessChapterBtn.onclick = () => {
        this.serie.chapter--;
        chapter.innerText = "Capítulo: ".concat(this.serie.chapter.toString());
      };
    } else {
      this.style.height = "425px";
    }
  }
}

window.customElements.define("sl-serie-card", SerieCard);
