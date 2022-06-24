import { CustomElement } from '../interfaces/CustomElement'
import ModalView from '../interfaces/ModalView'
import { Category } from '../interfaces/Models'

@CustomElement('sl-edit-category-modal')
export class EditCategoryModal extends ModalView {
  onSubmit?(categ: Category): Promise<void>;

  private titleDiv: HTMLDivElement = document.createElement('div')
  private titleSpan: HTMLSpanElement = document.createElement('span')
  private closeBtn: HTMLButtonElement = document.createElement('button')
  private nameInput: HTMLInputElement = document.createElement('input')
  private submitBtn: HTMLButtonElement = document.createElement('button')

  constructor (private categ: Category) {
    super()
  }

  async connectedCallback () {
    const separator = document.createElement('div')
    separator.className = 'separator'
    const separator2 = document.createElement('div')
    separator2.className = 'separator'
    this.window.append(
      this.titleDiv,
      separator,
      this.nameInput,
      separator2,
      this.submitBtn
    )
    this.titleDiv.append(this.titleSpan, this.closeBtn)
    this.titleDiv.className = 'title'

    this.nameInput.type = 'text'
    this.nameInput.value = this.categ.name

    this.titleSpan.innerText = 'Renombrar categoría'
    this.closeBtn.className = 'title-btn'
    this.closeBtn.innerText = 'X'
    this.closeBtn.onclick = () => {
      this.remove()
    }

    this.submitBtn.innerText = 'Renombrar'
    this.submitBtn.onclick = async () => {
      console.log('Edit category with name', this.nameInput.value)
      await this.onSubmit!({
        _id: this.categ._id!,
        name: this.nameInput.value,
        timestamp: new Date()
      })
      this.remove()
    }
  }
}
