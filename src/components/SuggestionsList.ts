import IComponent from '../interfaces/Component'
import { CustomElement } from '../interfaces/CustomElement'

@CustomElement('sl-suggestions-list')
export class SuggestionsList extends IComponent {
  private shadowDom: ShadowRoot
  generateList?: (x: { input: HTMLInputElement, worker: Worker }) => Promise<void>

  constructor () {
    super()
    this.shadowDom = this.attachShadow({ mode: 'closed' })
  }

  connectedCallback () {
    const list: HTMLUListElement = document.createElement('ul')
    list.style.listStyleType = 'none'
    list.style.margin = '0'
    list.style.padding = '0'
    list.style.overflowY = 'auto'
    list.style.maxHeight = '250px'
    this.shadowDom.append(list)
    this.generateList = async (x) => {
      list.textContent = ''
      list.append(document.createElement('progress'))
      x.worker.onmessage = async (e) => {
        list.textContent = ''
        const data = e.data as Array<string>
        for await (const item of data) {
          const entry = document.createElement('li')
          entry.innerText = item
          entry.onclick = () => {
            x.input.value = item
            list.textContent = ''
          }
          entry.style.padding = '10px'
          entry.style.border = 'solid 2px #353a4b'
          entry.style.transition = 'background linear 0.3s, color linear 0.3s'
          entry.onmouseenter = () => {
            entry.style.backgroundColor = '#3b3f49'
          }
          entry.onmouseleave = () => {
            entry.style.backgroundColor = '#282c34'
          }
          entry.onmousedown = () => {
            entry.style.borderColor = '#89ddff'
          }
          entry.onmouseup = () => {
            entry.style.borderColor = '#3b3f49'
          }
          list.append(entry)
        }
      }
      x.worker.onerror = (e) => {
        console.log(e)
      }
      x.worker.onmessageerror = (e) => {
        console.log(e)
      }
      x.worker.postMessage(x.input.value)
    }
  }
}
