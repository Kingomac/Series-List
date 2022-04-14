import { ContextMenuBuilder } from "../builders/ContextMenu";
import { AuthChangeEvent } from "../controllers/auth/FirebaseAuthController";
import AuthStatus from "../interfaces/AuthStatus";
import IComponent from "../interfaces/Component";
import { IDbClient } from "../interfaces/DbClient";
import { Serie } from "../interfaces/Models";
import "../styles/SerieCard.scss";

export class SerieCard extends IComponent {
  private initialChapter: number;
  private readonly titleSpan: HTMLSpanElement = document.createElement("span");
  private readonly img: HTMLImageElement = document.createElement("img");
  private readonly chapter: HTMLElement = document.createElement("i");
  private readonly actions = document.createElement("div");
  private readonly addChapterBtn = document.createElement("button");
  private readonly lessChapterBtn = document.createElement("button");
  private readonly editBtn = document.createElement("button");
  private readonly deleteBtn = document.createElement("button");
  private readonly viewBtn = document.createElement("button");

  static get observedAttributes(): string[] {
    return ["alt"];
  }

  constructor(
    private serie: Serie,
    private categId: string,
    private client: IDbClient
  ) {
    super();
    this.initialChapter = this.serie.chapter;
    this.append(this.img, this.titleSpan, this.chapter);
  }
  connectedCallback(): void {
    this.id = this.serie._id!;

    this.img.draggable = false;
    this.img.loading = "lazy";

    this.img.src = this.serie.image;
    this.img.alt = `Cover art of ${this.serie.name} (${this.serie.nameAlt})`;

    this.titleSpan.innerText = this.serie.name;
    this.chapter.innerText = "Capítulo: ".concat(this.serie.chapter.toString());

    this.actions.classList.add("card", "actions");
    this.addChapterBtn.innerText = "▶";
    this.lessChapterBtn.innerText = "◀";
    this.editBtn.innerText = "✏";
    this.deleteBtn.innerText = "🗑";
    this.viewBtn.innerText = "↗";

    this.actions.append(
      this.lessChapterBtn,
      this.addChapterBtn,
      this.viewBtn,
      this.editBtn,
      this.deleteBtn
    );

    this.addChapterBtn.onclick = async () => {
      this.serie.chapter++;
      this.chapter.innerText = "Capítulo: ".concat(
        this.serie.chapter.toString()
      );
    };
    this.lessChapterBtn.onclick = () => {
      this.serie.chapter--;
      this.chapter.innerText = "Capítulo: ".concat(
        this.serie.chapter.toString()
      );
    };
    this.editBtn.onclick = async () => {
      const { default: EditSerieModal } = await import("./EditSerieModal");
      const editModal = new EditSerieModal(this.serie);
      this.draggable = false;
      editModal.onSubmit = async (serie) => {
        console.log("Serie edited:", serie);
        this.serie = serie;
        await this.client.updateSerieInfo(this.categId, serie);
        this.img.style.backgroundImage = `url(${this.serie.image})`;
        this.titleSpan.innerText = this.serie.name;
        this.chapter.innerText = "Capítulo: ".concat(
          this.serie.chapter.toString()
        );
      };
      editModal.disconnectedCallback = () => (this.draggable = true);
      this.append(editModal);
    };
    this.actions.onmouseleave = this.saveChapter;
    this.deleteBtn.onclick = this.deleteSerie;
    this.viewBtn.onclick = () => {
      window.open(this.serie.url, "_blank");
    };
    this.oncontextmenu = async (ev: MouseEvent) => {
      ev.preventDefault();
      console.log("context menu for seriecard");
      const menu = await new ContextMenuBuilder()
        .button("Copiar título", async () => {
          navigator.clipboard.writeText(this.serie.name);
        })
        .button("Copiar título alternativo", async () => {
          navigator.clipboard.writeText(this.serie.nameAlt);
        })
        .build({ mouseX: ev.pageX, mouseY: ev.pageY });
      this.append(menu);
    };
    this.ondragstart = (ev: DragEvent) => {
      ev.dataTransfer?.setData("serie", JSON.stringify(this.serie));
    };
  }

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

  async authChangeEvent(x: AuthChangeEvent) {
    if (x.status == AuthStatus.SUDO) {
      this.draggable = true;
      this.append(this.actions);
    } else this.actions.remove();
    console.log("CARD AUTH CHANGE");
  }
}

window.customElements.define("sl-serie-card", SerieCard);
