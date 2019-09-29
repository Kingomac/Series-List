function deleteAnime(anime) {
  let confirmation = confirm("¿Seguro que quieres borrarlo?");
  if (confirmation) db.collection(tabs.getSelectedTab()).doc(anime).delete();
}

function loadAnime(anime) {
  let db = firebase.firestore();
  db.collection(tabs.getSelectedTab()).doc(anime).get().then(doc => {
    let data = doc.data();
    document.querySelectorAll('.labelfor').forEach(item => {
      item.setAttribute('class', 'labelfor active');
    });
    document.querySelector('#menu-title').innerHTML = 'Editar ' + data.nombre_jp;
    document.querySelector('#menu-submit').innerHTML = 'Actualizar';
    document.querySelector('#namae').value = data.nombre_jp;
    document.querySelector('#nombre').value = data.nombre_en;
    document.querySelector('#imagen').value = data.imagen;
  });
}

function moveTo(id, nombre_en, nombre_jp, imagen, where) {
  db.collection(where).doc().set({
    nombre_jp,
    nombre_en,
    imagen,
    actualizado_en: timestamp
  });
  db.collection(tabs.getSelectedTab()).doc(id).delete();
}

function updateCards() {
  db.collection(tabs.getSelectedTab()).orderBy(getFinalFilter()).onSnapshot(snapshop => {
    let template = '';
    snapshop.forEach(doc => {
      template += makeTemplate(doc.id, doc.data());
    })
    document.getElementById(tabs.getSelectedTab()).innerHTML = template;
    ui.initDropdowns();
  });
}

function buscar(termino) {
  let db = firebase.firestore();
  db.collection(tabs.getSelectedTab()).orderBy(getFinalFilter()).onSnapshot((resp) => {
    let template = '';
    resp.forEach((doc) => {
      let data = doc.data();
      if (data.nombre_jp.toLowerCase().startsWith(termino.toLowerCase()) || data.nombre_en.toLowerCase().startsWith(termino.toLowerCase())) {
        template += makeTemplate(doc.id, data);
      }
    })
    document.getElementById('busqueda').innerHTML = template;
  })
  ui.initDropdowns();
}

var mostrarNombreEnglish = false;

function makeTemplate(id, data) {
  let template = '';
  let nombre;
  if (controller.mostrarNombreEnglish) nombre = data.nombre_en;
  else nombre = data.nombre_jp;
  template += //html
    ` 
      <div class="card align-center" style="display: inline-block">
      <div class="card-image">
        <img class="responsive-img" src="${data.imagen}">
      </div>
      <div class="card-content">
      <span class="card-title">${nombre}</span>
      </div>
      <div class="card-action grey darken-4 right-align">
          <button class="btn-floating waves-effect waves-dark white" onclick="controller.loadAnime('${id}')"><i class="material-icons md-dark">edit</i></button>
        <button class="btn-floating waves-effect waves-dark white" onclick="controller.deleteAnime('${id}')"><i class="material-icons md-dark">delete</i></button>
        <button class="btn-floating waves-effect waves-dark white dropdown-trigger" data-target="dropdown-${id}"><i class="material-icons md-dark">more_vert</i></button>
      </div>
    </div>
    <ul id="dropdown-${id}" class="dropdown-content">
    <li><a role="button" onclick="controller.moveTo('${id}', '${data.nombre_en}' , '${data.nombre_jp}' , '${data.imagen}' , 'viendo')">Mover a viendo</a></li>
    <li><a role="button" onclick="controller.moveTo('${id}', '${data.nombre_en}' , '${data.nombre_jp}' , '${data.imagen}' , 'vistos')">Mover a vistos</a></li>
    <li><a role="button" onclick="controller.moveTo('${id}', '${data.nombre_en}' , '${data.nombre_jp}' , '${data.imagen}' , 'favoritos')">Mover a favoritos</a></li>
    <li><a role="button" onclick="controller.moveTo('${id}', '${data.nombre_en}' , '${data.nombre_jp}' , '${data.imagen}' , 'odiados')">Mover a odiados</a></li>
    <li><a role="button" onclick="controller.moveTo('${id}', '${data.nombre_en}' , '${data.nombre_jp}' , '${data.imagen}' , 'pendientes')">Mover a pendientes</a></li>
    </ul>
      `
  return template;
}

function getFinalFilter() {
  if (typeof ui.getSelectedFilter() === 'undefined' || ui.getSelectedFilter() == []) {
    return 'actualizado_en';
  } else {
    return ui.getSelectedFilter()[0];
  }
}
module.exports = {
  deleteAnime,
  updateCards,
  moveTo,
  loadAnime,
  buscar,
  getFinalFilter,
  mostrarNombreEnglish
}