import IComponent from './Component'
// import Modal from "bundle-text:../styles/Modal.scss";

export default abstract class ModalView extends IComponent {
  onSubmit?(data: any): void;
  private shadowDom: ShadowRoot
  protected window: HTMLDivElement = document.createElement('div')
  private main: HTMLElement = document.createElement('main')
  constructor () {
    super()
    this.shadowDom = this.attachShadow({ mode: 'open' })
    const styles = document.createElement('style')
    // styles.textContent = Modal;
    this.shadowDom.append(styles)
    this.shadowDom.innerHTML = `
    <style>
main {
  position: absolute;
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

.separator {
  width: 100%;
  height: 3px;
  background-color: #89ddff;
  margin-bottom: 5px;
  margin-top:5px;
}

.window {
  border: solid 1px #272b3a;
  border-radius: 5px;
  color: white;
  margin-top: 15vh;
  margin-left: 15vw;
  margin-right: 15vw;
  background-color: #2e3345;
  padding: 10px;
  width: 50vw;
  height: min-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
@media (max-width: 900px) {
    .window {
  width: 100%;
  margin-left: 2px;
  margin-right: 2px;
  }
 }

input {
margin: 4px;
vertical-align: middle;
padding: 10px;
font-size: 14px;
border-top: none;
border-left: none;
border-right: none;
border-bottom: solid 2px gray;
transition: border-bottom-color linear 0.2s, background-color linear 0.2s;
}

input:hover {
  background-color: #ededed;
}

input:focus {
border-top: none;
border-left: none;
border-right: none;
border-bottom: solid 2px #89ddff;
outline:none;
background-color: #d9d9d9;
}

button {
font-family: Arial, Helvetica, sans-serif;
margin: 5px;
padding: 10px;
text-transform: uppercase;
white-space: nowrap;
letter-spacing: 2px;
font-weight: bold;
color: white;
background-color: transparent;
border: none;
border-radius: 5px;
transition: background-color ease-in-out 0.2s;
}
button:hover {
cursor: pointer;
background-color: #24272e;
}
button:active {
background-color: #4c515c;
}


.title {
  width: 100%;
  margin-top: 0;
  margin-left: 20px;
  display: flex;
  flex-direction: row;
}

span {
  width: 90%;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-top: 5px;
}

.title-btn {
width: 35px;
height: 35px;
border-radius: 35px;
border: none;
background-color: transparent;
color: white;
font-weight: bold;
font-size: large;
margin-top: 0;
transition: background-color ease-in-out 0.2s;
text-align: center;
padding: 0;
}
.title-btn:hover {
  background-color: #232736;
}

.title-btn:active {
  background-color: #555b73;
}

.all-container {
  display: flex;
  flex-direction: row;
}

.inputs-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.img-prev {
  margin: 0 2% 0 2%;
  width: 250px;
  height: 400px;
}

@media (max-width: 900px) {
  .all-container {
    display: flex;
    flex-direction: column-reverse;
  }
  .img-prev {
    align-self: center;
  }
}
    </style>
    `
    this.window.className = 'window'
    this.shadowDom.append(this.main)
    this.main.append(this.window)
  }
}
