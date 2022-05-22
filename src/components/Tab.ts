import { ContextMenuBuilder } from '../builders/ContextMenu'
import IComponent from '../interfaces/Component'
import { Category, Serie } from '../interfaces/Models'

export interface ITab extends Category {
  url: string;
}
export class Tab extends IComponent {
  public onActive?: () => void
  public onDropSerie?: (serie: Serie) => void
  /**
   * Fires a delete this category event
   */
  public onDelete?: (categId: string) => Promise<void>
  public onEditCateg?: (categ: Category) => Promise<void>

  static get observedAttributes () {
    return ['active']
  }

  constructor (public tab: ITab) {
    super()
    this.onclick = () => {
      history.pushState(null, '', this.tab._id!)
      this.onActive!()
    }
    this.oncontextmenu = async (ev) => {
      ev.preventDefault()
      const menu = await new ContextMenuBuilder()
        .button('Editar', async () => await this.onEditCateg!(this.tab))
        .button('Eliminar', async () => {
          alert('CHILLING BROOOOOO, CHILLING!!!!!!!!!')
        })
        .build({ mouseX: ev.pageX, mouseY: ev.pageY })
      this.append(menu)
    }
    this.ondrop = (ev: DragEvent) => {
      const data = ev.dataTransfer?.getData('serie')
      if (data === undefined) throw new Error('Serie dragged is undefined')
      const serie = JSON.parse(data) as Serie
      console.log('Serie dragged:', serie)
      this.onDropSerie!(serie)
    }
    this.ondragover = (ev: DragEvent) => {
      ev.preventDefault()
    }
  }

  connectedCallback () {
    this.innerText = this.tab.name
  }

  getData (): ITab {
    return this.tab
  }

  attributeChangedCallback (name: string, lastValue: any, newValue: any) {
    if (name === Tab.observedAttributes[0]) {
      if (newValue === 'true') {
        // this.style.backgroundColor = "#3b3f49";
        this.style.color = '#89ddff'
        this.style.borderBottomColor = '#89ddff'
      } else {
        // this.style.removeProperty("background-color");
        this.style.removeProperty('border-bottom-color')
        this.style.removeProperty('color')
      }
    }
  }
}

window.customElements.define('sl-tab', Tab)
