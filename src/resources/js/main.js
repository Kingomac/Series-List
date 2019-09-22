const controller = require('../resources/js/animeController');
const tabs = require('../resources/js/tabs');
const ui = require('../resources/js/ui');
const firebase = require('firebase');

const firebaseConfig = {
  apiKey: "AIzaSyBF3Q8IMzrcBjPROUKjPfaVq0ZiQfOnCPo",
  authDomain: "what-anime-i-see.firebaseapp.com",
  databaseURL: "https://what-anime-i-see.firebaseio.com",
  projectId: "what-anime-i-see",
  storageBucket: "what-anime-i-see.appspot.com",
  messagingSenderId: "239560464048",
  appId: "1:239560464048:web:5f6e2c6391780d896e0d75"
};

firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
firebase.auth().signInWithEmailAndPassword('kingomacyt@gmail.com', "javascript");
const timestamp = firebase.firestore.FieldValue.serverTimestamp();

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#add-anime-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      nombre_en: document.querySelector('#nombre').value,
      generos: document.querySelector('#generos').value,
      salida: document.querySelector('#salida').value,
      imagen: document.querySelector('#imagen').value,
      actualizado_en: timestamp
    }
    db.collection(tabs.getSelectedTab()).doc(document.querySelector('#namae').value).set(data);
    document.querySelector('#add-anime-form').reset();

    document.querySelector('#menu-title').innerHTML = 'Añadir anime';
    document.querySelector('#menu-submit').innerHTML = 'Añadir';
  });

  document.addEventListener('close', () => {
    firebase.auth().signOut();
  });
  ui.resizeColumns() //Execute at start
  document.querySelector('#closeBut').addEventListener('click', (e) => {
    close();
  });
  document.querySelector('#maximizeBut').addEventListener('click', (e) => {
    let mainWindow = require('electron').remote.BrowserWindow.getFocusedWindow();
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    else mainWindow.maximize();
  });
  document.querySelector('#minimizeBut').addEventListener('click', (e) => {
    require('electron').remote.BrowserWindow.getFocusedWindow().minimize();
  });
  document.querySelector('#toggleMenu').addEventListener('click', (e) => {
    let menu = document.querySelector('#animeMenu');
    if (menu.getAttribute('class').includes('menu-active')) {
      menu.setAttribute('class', 'col m3 l2 grey darken-4 menu');
      setTimeout(() => {
        console.log('set display none');
        menu.setAttribute('class', 'col m3 l2 grey darken-4 menu-closed');
      }, 500);
    } else {
      menu.setAttribute('class', 'col m3 l2 grey darken-4 menu');
      setTimeout(() => {
        menu.setAttribute('class', 'col m3 l2 grey darken-4 menu-active')
      }, 300);
    }
  });

  //Tabs system
  tabs.changeTab('viendo');
  document.querySelectorAll('.tab').forEach(tab => {
    tab.firstChild.addEventListener('click', (e) => {
      tabs.changeTab(tab.firstChild.id.replace('-a', ''));
    })
  })

  window.addEventListener('resize', () => {
    setInterval(ui.resizeColumns(), 75);
  });
  ui.initDropdowns();
  M.Tabs.init(document.querySelector('.tabs'));
})