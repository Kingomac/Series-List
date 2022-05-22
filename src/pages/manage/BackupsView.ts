import BackupController from '../../controllers/BackupController'
import IComponent from '../../interfaces/Component'

export default class BackupsView extends IComponent {
  constructor (private controller: BackupController) {
    super()
  }

  connectedCallback () {
    const list = document.createElement('ul')
    const saveLi = document.createElement('li')
    const loadLi = document.createElement('li')

    const saveBtn = document.createElement('button')
    saveBtn.innerText = 'Guardar copia de seguridad'
    saveBtn.onclick = async () => {
      await this.controller.save()
    }

    const loadLabel = document.createElement('label')
    loadLabel.innerText = 'Cargar copia de seguridad'
    const loadInput = document.createElement('input')
    loadInput.type = 'file'
    loadInput.accept = '.json'
    loadInput.multiple = false
    const loadBtn = document.createElement('button')
    loadBtn.innerText = 'Cargar'
    loadInput.onchange = async () => {
      if (
        loadInput.files!.length > 0 &&
        confirm(
          `${loadInput.files!.item(0)!.name} - ${
            loadInput.files!.item(0)!.size / 1024
          } KB\nLa información de la base de datos no se eliminará ¿Quieres continuar?`
        )
      ) {
        await this.controller.load(loadInput.files?.item(0)!)
        alert('Backup cargado')
      }
    }
    this.append(list)
    loadLabel.append(loadInput)
    list.append(saveLi, loadLi)
    saveLi.append(saveBtn)
    loadLi.append(loadLabel)
  }
}

window.customElements.define('sl-backups-view', BackupsView)
