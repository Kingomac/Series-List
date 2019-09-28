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
  //Create anime
  document.querySelector('#add-anime-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      nombre_en: document.querySelector('#nombre').value,
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
    } else {
      menu.setAttribute('class', 'col m3 l2 grey darken-4 menu-active');
    }
  });

  //Tabs system
  tabs.changeTab('viendo');
  document.querySelectorAll('.tab').forEach(tab => {
      tab.firstChild.addEventListener('click', (e) => {
        tabs.changeTab(tab.firstChild.id.replace('-a', ''));
      })
    })
    //Toggle filter
  document.querySelector('#toggleFilter').addEventListener('click', () => {
    let filter = document.querySelector('#filterBar');
    if (filter.getAttribute('class').includes('active')) {
      filter.setAttribute('class', 'col s12 grey darken-4');
    } else {
      filter.setAttribute('class', 'col s12 grey darken-4 active');
    }
  })

  //Initialize search
  document.querySelector('#searchBox').addEventListener('input', () => {
    controller.buscar(document.querySelector('#searchBox').value);
    ui.mostrarBusqueda();
  })

  window.addEventListener('resize', () => {
    setInterval(ui.resizeColumns(), 75);
  });
  ui.initDropdowns();
  M.Tabs.init(document.querySelector('.tabs'));
})