import AuthStatus from "../interfaces/AuthStatus";
import IComponent from "../interfaces/Component";
import { IDbClient } from "../interfaces/DbClient";
import { IAuthController } from "../interfaces/IAuthController";
import { Serie } from "../interfaces/Models";
import "../styles/SerieCard.scss";

export class SerieCard extends IComponent {
  private initialChapter: number;
  private titleSpan: HTMLSpanElement = document.createElement("span");

  static get observedAttributes(): string[] {
    return ["alt"];
  }

  constructor(
    private serie: Serie,
    private categId: string,
    private client: IDbClient,
    private authController: IAuthController
  ) {
    super();
    this.initialChapter = this.serie.chapter;
  }
  connectedCallback(): void {
    this.id = this.serie._id!;
    if (this.authController.getStatus() === AuthStatus.SUDO) {
      this.setAttribute("draggable", "true");
    }
    // const img = document.createElement("div");
    const img = document.createElement("img");
    img.setAttribute("draggable", "false");
    img.setAttribute("loading", "lazy");
    const chapter = document.createElement("i");

    img.src = this.serie.image;
    this.titleSpan.innerText = this.serie.name;
    chapter.innerText = "Capítulo: ".concat(this.serie.chapter.toString());

    this.append(img, this.titleSpan, chapter);

    if (this.authController.getStatus() === AuthStatus.SUDO) {
      const actions = document.createElement("div");
      actions.classList.add("card", "actions");
      this.append(actions);

      const addChapterBtn = document.createElement("button");
      const lessChapterBtn = document.createElement("button");
      const editBtn = document.createElement("button");
      const deleteBtn = document.createElement("button");

      addChapterBtn.innerText = "▶";
      lessChapterBtn.innerText = "◀";
      editBtn.innerText = "✏";
      deleteBtn.innerText = "🗑";

      actions.append(lessChapterBtn, addChapterBtn, editBtn, deleteBtn);

      addChapterBtn.onclick = async () => {
        this.serie.chapter++;
        chapter.innerText = "Capítulo: ".concat(this.serie.chapter.toString());
      };
      lessChapterBtn.onclick = () => {
        this.serie.chapter--;
        chapter.innerText = "Capítulo: ".concat(this.serie.chapter.toString());
      };
      editBtn.onclick = async () => {
        const { default: EditSerieModal } = await import("./EditSerieModal");
        const editModal = new EditSerieModal(this.serie);
        this.setAttribute("draggable", "false");
        editModal.onSubmit = async (serie) => {
          console.log("Serie edited:", serie);
          this.serie = serie;
          await this.client.updateSerieInfo(this.categId, serie);
          //img.src = this.serie.image;
          img.style.backgroundImage = `url(${this.serie.image})`;
          this.titleSpan.innerText = this.serie.name;
          chapter.innerText = "Capítulo: ".concat(
            this.serie.chapter.toString()
          );
        };
        editModal.disconnectedCallback = () =>
          this.setAttribute("draggable", "true");
        this.append(editModal);
      };
      actions.onmouseleave = this.saveChapter;
      deleteBtn.onclick = this.deleteSerie;
    }
  }

  ondragstart = (ev: DragEvent) => {
    ev.dataTransfer?.setData("serie", JSON.stringify(this.serie));
  };

  saveChapter = async () => {
    if (this.initialChapter !== this.serie.chapter) {
      console.log("Saving chapter for serie:", this.serie);
      await this.client.updateSerieChapter(
        this.serie._id!!,
        this.categId,
        this.serie.chapter
      );
      this.initialChapter = this.serie.chapter;
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

  attributeChangedCallback(name: string, lastValue: any, newValue: any): void {
    if (name === SerieCard.observedAttributes[0]) {
      if (newValue == "true") {
        this.titleSpan.innerText = this.serie.nameAlt;
      } else {
        this.titleSpan.innerText = this.serie.name;
      }
    }
  }
}

window.customElements.define("sl-serie-card", SerieCard);
