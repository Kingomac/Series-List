import IComponent from "../interfaces/Component";

export class ContextMenuBuilder {
  private container: HTMLDivElement = document.createElement("div");
  private list: HTMLUListElement = document.createElement("ul");
  private buttons: { text: string; action: () => Promise<void> }[] = [];
  private shadowDom: ShadowRoot = this.container.attachShadow({ mode: "open" });

  constructor() {
    this.shadowDom.innerHTML = `
    <style>
      ul {
        position: absolute;
        display: block;
        padding: 0;
        background: aqua;
        list-style-type:none;
        border-radius: 10px;
        border: solid 3px white;
        overflow: hidden;
      }
      button {
        background-color: #2e3345;
        font-family: Arial;
        color: white;
        width: 100%;
        padding: 6px;
        font-weight: bold;
        border:none;
      }
      button:hover {
        background-color: #3b3f49;
      }
      button:active {
        background-color: #353a4b;
      }
    </style>
    `;
  }

  button(text: string, action: () => Promise<void>) {
    this.buttons.push({ text, action });
    return this;
  }

  async build(
    x: { mouseY: number; mouseX: number } = { mouseX: 0, mouseY: 0 }
  ) {
    document.onclick = document.onauxclick = () => {
      document.querySelectorAll(".context-menu").forEach((i) => i.remove());
    };
    this.container.className = "context-menu";
    for await (const i of this.buttons) {
      const li = document.createElement("li");
      const el = document.createElement("button");
      el.innerText = i.text;
      el.onclick = async () => {
        await i.action();
        this.container.remove();
      };
      this.list.append(li);
      li.append(el);
    }
    this.shadowDom.append(this.list);
    this.list.style.top = `${x.mouseY}px`;
    this.list.style.left = `${x.mouseX}px`;
    return this.container;
  }
}
