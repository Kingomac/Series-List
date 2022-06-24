import IComponent from '../interfaces/Component'
import { CustomElement } from '../interfaces/CustomElement'
import '../styles/NavigationDrawer.scss'

interface NavigatorItem {
  href: string;
  name: string;
}

@CustomElement('sl-navigation-drawer')
export default class NavigationDrawer extends IComponent {
  onItemClick?(x: NavigatorItem): void;

  constructor (private params?: { hrefRoot?: string }) {
    super()
  }

  connectedCallback () {}

  addItems (...items: NavigatorItem[]) {
    items.forEach((i) => {
      const a = document.createElement('a')
      a.id = i.name
      a.innerText = i.name
      a.href = i.href
      a.onclick = (ev) => {
        ev.preventDefault()
        window.history.pushState(null, '', this.params?.hrefRoot + i.href)
        this.onItemClick!(i)
      }
      this.append(a)
    })
  }

  removeItem (itemName: string) {
    this.querySelector(`#${itemName}`)?.remove()
  }
}
