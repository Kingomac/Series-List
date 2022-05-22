export class ContextMenuBuilder {
  private container: HTMLDivElement = document.createElement('div')
  private list: HTMLUListElement = document.createElement('ul')
  private buttons: { text: string; action: () => Promise<void> }[] = []
  private shadowDom: ShadowRoot = this.container.attachShadow({ mode: 'open' })

  constructor () {
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
    `
  }

  button (text: string, action: () => Promise<void>) {
    this.buttons.push({ text, action })
    return this
  }

  async build (
    x: { mouseY: number; mouseX: number } = { mouseX: 0, mouseY: 0 }
  ) {
    this.container.className = 'context-menu'
    for await (const i of this.buttons) {
      const li = document.createElement('li')
      const el = document.createElement('button')
      el.innerText = i.text
      el.onclick = async (ev) => {
        await i.action()
        this.container.remove()
        document.body.onclick = document.body.onclick = null
      }
      this.list.append(li)
      li.append(el)
    }
    this.shadowDom.append(this.list)
    this.list.style.top = `${x.mouseY}px`
    this.list.style.left = `${x.mouseX}px`
    document.body.onclick = document.body.onauxclick = (ev) => {
      console.log(ev.target, this.container.parentElement)
      if (
        ev.target !== this.container &&
        ev.target !== this.container.parentElement
      ) {
        this.container.remove()
        document.body.onclick = document.body.onclick = null
      }
    }
    return this.container
  }
}
