import IComponent from "./Component";

export default abstract class ModalView extends IComponent {
  onSubmit?(data: any): void;
  private shadowDom: ShadowRoot;
  protected window: HTMLDivElement = document.createElement("div");
  private main: HTMLElement = document.createElement("main");
  constructor() {
    super();
    this.shadowDom = this.attachShadow({ mode: "open" });
    this.shadowDom.innerHTML = `
    <style>
main {
  position: absolute;
  padding: 10px;
  z-index: 3;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  overflow-y: scroll;
}

div {
  width: 40vw;
  border-radius: 5px;
  color: white;
  margin-top: 15vh;
  margin-left: 15vw;
  margin-right: 15vw;
  margin-left: 15vw;
  margin-right: 15vw;
  background-color: black;
  padding: 10px;
  width: 40vw;
  height: min-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  }

@media (max-width: 500px) {  
  div {
  width: 100%;
  border-radius: 5px;
  color: white;
  margin-top: 15vh;
  margin-left: 15vw;
  margin-right: 15vw;
  margin-left: 15px;
  margin-right: 15px;
  background-color: black;
  padding: 10px;
  width: 40vw;
  height: min-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  }
}
@media (max-width: 900px) {
    div {
  width: 50vw;
  border-radius: 5px;
  color: white;
  margin-top: 15vh;
  margin-left: 15vw;
  margin-right: 15vw;
  margin-left: 15px;
  margin-right: 15px;
  background-color: black;
  padding: 10px;
  width: 40vw;
  height: min-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  }
 }

input,
button {
  margin: 4px;
  vertical-align: middle;
  padding: 5px;
}
div div {
  width: 36vw;
  margin-top: 0;
  margin-left: 20px;
  display: flex;
  flex-direction: row;
}

@media (max-width: 500px) {
  div div {
    width: 80%;
    right: 0;
    margin-top: 0;
    margin-left: 20px;
    display: flex;
    flex-direction: row;
  }
}

@media (max-width: 900px) {
    div div {
      width: 50vw;
      margin-top: 0;
      margin-left: 20px;
      display: flex;
      flex-direction: row;
    }
  }

span {
  width: 100%;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
    </style>
    `;
    this.shadowDom.append(this.main);
    this.main.append(this.window);
  }
}
