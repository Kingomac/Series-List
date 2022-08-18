import ModalView from '../interfaces/ModalView'
import { Serie } from '../interfaces/Models'
import { isDebug } from '../../app.config'
import { CustomElement } from '../interfaces/CustomElement'
import { SuggestionsList } from './SuggestionsList'

@CustomElement('sl-add-serie-modal')
export class AddSerieModal extends ModalView {
  onSubmit?(serie: Serie): Promise<void>;

  private nameInput = document.createElement('input')
  private altNameInput = document.createElement('input')
  private imgInput = document.createElement('input')
  private imgPrev = document.createElement('img')
  private urlInput = document.createElement('input')
  private chapterInput = document.createElement('input')

  private titleDiv = document.createElement('div')
  private titleSpan = document.createElement('span')
  private modalClose = document.createElement('button')

  private submitBtn = document.createElement('button')
  private suggestionsWorker?: Worker

  async connectedCallback () {
    const separator = document.createElement('div')
    separator.className = 'separator'
    const separator2 = document.createElement('div')
    separator2.className = 'separator'
    const inputsContainer = document.createElement('div')
    const allContainer = document.createElement('div')
    inputsContainer.className = 'inputs-container'
    allContainer.className = 'all-container'
    this.imgPrev.className = 'img-prev'
    const autocompleteBtn = document.createElement('button')
    const suggestionList = new SuggestionsList()
    const suggestionListAlt = new SuggestionsList()

    inputsContainer.append(
      this.nameInput,
      suggestionList,
      this.altNameInput,
      suggestionListAlt,
      this.imgInput,
      this.urlInput,
      this.chapterInput
    )

    allContainer.append(inputsContainer, this.imgPrev)

    this.window.append(
      this.titleDiv,
      separator,
      allContainer,
      separator2,
      this.submitBtn,
      autocompleteBtn
    )
    this.titleDiv.append(this.titleSpan, this.modalClose)

    this.titleDiv.className = 'title'

    this.nameInput.type = 'text'
    this.altNameInput.type = 'text'
    this.imgInput.type = 'text'
    this.urlInput.type = 'text'
    this.chapterInput.type = 'number'

    this.nameInput.placeholder = 'Nombre'
    this.altNameInput.placeholder = 'Nombre alternativo'
    this.imgInput.placeholder = 'Link imagen'
    this.urlInput.placeholder = 'Url'
    this.chapterInput.value = '0'

    this.titleSpan.innerText = 'Añadir serie'
    this.modalClose.className = 'title-btn'
    this.modalClose.innerText = 'X'
    this.modalClose.onclick = () => {
      if (this.suggestionsWorker !== undefined) {
        this.suggestionsWorker.terminate()
      }
      this.remove()
    }
    this.submitBtn.innerText = 'Añadir'
    this.submitBtn.onclick = async () => await this.submit()
    this.onkeydown = async (e) => {
      if (e.key === 'Enter') {
        await this.submit()
      } else if (e.key === 'Escape') {
        this.remove()
      }
    }
    if (isDebug()) {
      this.submitBtn.oncontextmenu = async (e) => {
        e.preventDefault()
        const { default: Placeholders } = await import(
          '../../test/Placeholders'
        )
        const { runLoading } = await import('./RunLoading')
        await runLoading(async () => {
          for (let i = 0; i < 14; i++) {
            const s = await Placeholders.getRandomSerie()
            delete s._id
            delete s.timestamp
            await this.onSubmit!(s)
          }
        }, this.submitBtn)
      }
    }
    this.imgInput.oninput = () => {
      this.imgPrev.src = this.imgInput.value
    }

    autocompleteBtn.innerText = 'Autocompletar'
    this.nameInput.oninput = (mEv) => {
      if (this.nameInput.value.length < 3) return
      if (this.suggestionsWorker === undefined) {
        this.suggestionsWorker = new Worker(new URL('../../public/workers/autocomplete.js', import.meta.url), { type: 'classic' })
      }
      suggestionList.generateList!({ input: this.nameInput, worker: this.suggestionsWorker })
    }

    this.altNameInput.oninput = () => {
      if (this.altNameInput.value.length < 3) return
      if (this.suggestionsWorker === undefined) {
        this.suggestionsWorker = new Worker(new URL('../../public/workers/autocomplete.js', import.meta.url), { type: 'classic' })
      }
      suggestionListAlt.generateList!({ input: this.altNameInput, worker: this.suggestionsWorker })
    }

    this.generateData()
  }

  private async submit () {
    const { runLoading } = await import('./RunLoading')
    await runLoading(async () => {
      await this.onSubmit!({
        name: this.nameInput.value,
        nameAlt: this.altNameInput.value,
        chapter: this.chapterInput.valueAsNumber,
        image: this.imgInput.value,
        url: this.urlInput.value
      })
    }, this.submitBtn)
    await this.clearInputs()
    await this.generateData()
  }

  private async clearInputs () {
    this.nameInput.value = ''
    this.altNameInput.value = ''
    this.imgInput.value = ''
    this.urlInput.value = ''
    this.chapterInput.value = '0'
  }

  private async generateData () {
    if (isDebug()) {
      const { default: Placeholders } = await import('../../test/Placeholders')
      const serie = await Placeholders.getRandomSerie()
      this.nameInput.value = serie.name
      this.altNameInput.value = serie.nameAlt
      this.imgInput.value = serie.image
      this.urlInput.value = serie.url
      this.imgPrev.src = serie.image
    }
  }
}
