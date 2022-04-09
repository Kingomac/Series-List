import IComponent from "../../interfaces/Component";

export default class MigrationsView extends IComponent {
  constructor(private x?: { fromOldMigration?(): void }) {
    super();
  }

  connectedCallback() {
    const list = document.createElement("ul");
    const fromOldMigrationBtn = document.createElement("button");
    fromOldMigrationBtn.innerText = "Migrar desde Firebase Old";
    this.append(list);
    if (this.x && this.x.fromOldMigration)
      fromOldMigrationBtn.onclick = () => this.x?.fromOldMigration!();
    const fromOldMigrationLi = document.createElement("li");
    list.append(fromOldMigrationLi);
    fromOldMigrationLi.append(fromOldMigrationBtn);
  }
}

window.customElements.define("sl-migrations-view", MigrationsView);
