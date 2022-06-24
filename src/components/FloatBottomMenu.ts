import IComponent from '../interfaces/Component'
import { CustomElement } from '../interfaces/CustomElement'

@CustomElement('sl-float-bottom-menu')
export class FloatBottomMenu extends IComponent {
  onNewSerie?(): void;
  onAltSwitch?(x: { alt: boolean }): void;

  private addSerieBtn: HTMLButtonElement = document.createElement('button')
  private switchAltBtn: HTMLButtonElement = document.createElement('button')
  private alt: boolean = false

  connectedCallback (): void {
    this.append(this.switchAltBtn, this.addSerieBtn)
    this.switchAltBtn.innerText = '🇯🇵'
    this.switchAltBtn.onclick = () => {
      this.alt = !this.alt
      this.switchAltBtn.innerText = this.alt ? '🇬🇧' : '🇯🇵'
      this.onAltSwitch!({ alt: this.alt })
    }
    this.addSerieBtn.innerText = '+'
    this.addSerieBtn.onclick = () => {
      this.onNewSerie!()
    }
  }
}
