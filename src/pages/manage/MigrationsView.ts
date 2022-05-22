import IComponent from '../../interfaces/Component'

export default class MigrationsView extends IComponent {
  constructor (private x?: { fromOldMigration?(): void }) {
    super()
  }

  connectedCallback () {
    const list = document.createElement('ul')
    const el = document.createElement('span')
    el.innerText = 'xd, mejor no tocar nada'
    this.append(list)
    list.append(el)
  }
}

window.customElements.define('sl-migrations-view', MigrationsView)
