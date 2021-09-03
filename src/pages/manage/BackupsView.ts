import BackupController from "../../controllers/BackupController";
import IComponent from "../../interfaces/Component";

export default class BackupsView extends IComponent {
  constructor(private controller: BackupController) {
    super();
  }

  connectedCallback() {
    const saveBtn = document.createElement("button");
    saveBtn.innerText = "Guardar copia de seguridad";
    saveBtn.onclick = async () => {
      await this.controller.save();
    };

    const loadDiv = document.createElement("div");
    const loadLabel = document.createElement("label");
    loadLabel.innerText = "Cargar copia de seguridad";
    const loadInput = document.createElement("input");
    loadInput.type = "file";
    //loadBtn.accept = ".json";
    loadInput.multiple = false;
    const loadBtn = document.createElement("button");
    loadBtn.innerText = "Cargar";
    loadBtn.onclick = () => {
      this.controller.load(loadInput.files?.item(0)!);
    };
    this.append(saveBtn, loadDiv);
    loadDiv.append(loadLabel, loadInput, loadBtn);
  }
}

window.customElements.define("sl-backups-view", BackupsView);
