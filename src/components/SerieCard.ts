import Component from "../interfaces/Component";
import { Category, Serie } from "../interfaces/Models";
import "../styles/SerieCard.scss";

export class SerieCard extends Component {
  constructor(private serie: Serie, private categ: Category) {
    super();
  }
  connectedCallback(): void {
    const img = document.createElement("img");
    const title = document.createElement("span");
    const chapter = document.createElement("i");
    const actions = document.createElement("div");

    img.src = this.serie.image;
    title.innerText = this.serie.name;
    chapter.innerText = "Capítulo: ".concat(this.serie.chapter.toString());
    actions.classList.add("card", "actions");

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

    this.append(img, title, chapter, actions);
    actions.append(lessChapterBtn, addChapterBtn, editBtn, deleteBtn, moveBtn);

    addChapterBtn.onclick = () => {
      this.serie.chapter++;
      chapter.innerText = "Capítulo: ".concat(this.serie.chapter.toString());
    };
    lessChapterBtn.onclick = () => {
      this.serie.chapter--;
      chapter.innerText = "Capítulo: ".concat(this.serie.chapter.toString());
    };
  }
}

window.customElements.define("sl-serie-card", SerieCard);
