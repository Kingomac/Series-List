import WSAuthController from "../controllers/auth/WSAuthController";
import IComponent from "../interfaces/Component";
import { IDbClient } from "../interfaces/DbClient";
import { IAuthController } from "../interfaces/IAuthController";
import { Category, Serie } from "../interfaces/Models";
import "../styles/SerieCard.scss";

export class SerieCard extends IComponent {
  private initialChapter: number;

  constructor(
    private serie: Serie,
    private categId: string,
    private client: IDbClient,
    private authController: IAuthController
  ) {
    super();
    this.initialChapter = this.serie.chapter;
    console.log(this.serie);
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

      addChapterBtn.onclick = async () => {
        this.serie.chapter++;
        chapter.innerText = "Capítulo: ".concat(this.serie.chapter.toString());
      };
      lessChapterBtn.onclick = () => {
        this.serie.chapter--;
        chapter.innerText = "Capítulo: ".concat(this.serie.chapter.toString());
      };
      actions.onmouseleave = this.saveChapter;
      deleteBtn.onclick = this.deleteSerie;
    } else {
      this.style.height = "425px";
    }
  }

  saveChapter = async () => {
    if (this.initialChapter !== this.serie.chapter) {
      await this.client.updateSerieChapter(
        this.serie._id!!,
        this.categId,
        this.serie.chapter
      );
    }
  };

  deleteSerie = async () => {
    this.style.transition = "visibility 0.3s linear,opacity 0.3s linear";
    this.style.opacity = "0";
    this.style.visibility = "hidden";
    await this.client.deleteSerieById(this.serie._id!!, this.categId);
    setTimeout(() => {
      this.remove();
    }, 1000);
  };
}

window.customElements.define("sl-serie-card", SerieCard);
