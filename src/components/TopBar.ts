import { AuthChangeEvent } from '../controllers/auth/FirebaseAuthController'
import AuthStatus from '../interfaces/AuthStatus'
import IComponent from '../interfaces/Component'
import { CustomElement } from '../interfaces/CustomElement'
import { Route } from '../routes'
import '../styles/TopBar.scss'

@CustomElement('sl-topbar')
export default class TopBar extends IComponent {
  private static attrTitle: string = 'title'
  private titleSpan: HTMLSpanElement = document.createElement('span')
  private fujiwara: HTMLImageElement = document.createElement('img')

  static get observedAttributes () {
    return ['title']
  }

  constructor (
    private x: {
      authModule: IComponent;
      changeView: (path: Route) => Promise<void>;
    }
  ) {
    super()
  }

  connectedCallback (): void {
    this.append(this.fujiwara, this.titleSpan, this.x.authModule)
    this.titleSpan.innerText = this.getAttribute('title') || ''
    this.fujiwara.src =
      'https://firebasestorage.googleapis.com/v0/b/prueba-d1c99.appspot.com/o/fujiwara-chika.webp?alt=media&token=7d9c75ef-55e9-4696-a9bc-2e85700222f4'
    this.fujiwara.alt = 'Fujiwara Chika detective'
  }

  attributeChangedCallback (name: string, lastValue: any, newValue: any) {
    if (name === TopBar.attrTitle) {
      this.titleSpan.innerText = newValue
    }
  }

  authChangeEvent = async (state: AuthChangeEvent) => {
    console.log('Topbar auth change')
    if (state.status === AuthStatus.SUDO) {
      this.fujiwara.onclick = () => {
        if (!window.location.pathname.split('/').includes('manage')) {
          window.history.pushState(null, '', '/manage')
          this.x.changeView(Route.MANAGE)
        }
      }
      this.titleSpan.onclick = () => {
        if (window.location.pathname.split('/').includes('manage')) {
          window.history.pushState(null, '', '/')
          this.x.changeView(Route.SERIES)
        }
      }
    } else {
      this.fujiwara.onclick = () => {}
      this.titleSpan.onclick = () => {}
    }
  }
}
