//Require Firebase
//Sign in Firebase
function deleteAnime(anime) {
  let confirmation = confirm("¿Seguro que quieres borrarlo?");
  if (confirmation) db.collection(tabs.getSelectedTab()).doc(anime).delete();
}

function loadAnime(anime) {
  db.collection(tabs.getSelectedTab()).doc(anime).get().then(doc => {
    let data = doc.data();
    document.querySelectorAll('.labelfor').forEach(item => {
      item.setAttribute('class', 'labelfor active');
    });
    document.querySelector('#menu-title').innerHTML = 'Editar ' + anime;
    document.querySelector('#menu-submit').innerHTML = 'Actualizar';
    document.querySelector('#namae').value = anime;
    document.querySelector('#nombre').value = data.nombre_en;
    document.querySelector('#generos').value = data.generos;
    document.querySelector('#salida').value = data.salida;
    document.querySelector('#imagen').value = data.imagen;
  });
}

function moveTo(id, nombre_en, generos, salida, imagen, where) {
  db.collection(tabs.getSelectedTab()).doc(id).delete();
  db.collection(where).doc(id).set({
    nombre_en,
    generos,
    salida,
    imagen,
    actualizado_en: timestamp
  });
  setTimeout(tabs.changeTab(actualTab), 1000);
}

function updateCards() {
  db.collection(tabs.getSelectedTab()).onSnapshot(snapshop => {
    let template = '';
    snapshop.forEach(doc => {
      let data = doc.data();
      template += //html
        `
              <div class="card align-center" style="display: inline-block">
              <div class="card-image">
                <img class="responsive-img" src="${data.imagen}">
              </div>
              <div class="card-content">
              <span class="card-title">${doc.id}</span>
                <p>${data.generos}</p>
              </div>
              <div class="card-action grey darken-4 right-align">
                  <button class="btn-floating waves-effect waves-dark white" onclick="loadAnime('${doc.id}')"><i class="material-icons md-dark">edit</i></button>
                <button class="btn-floating waves-effect waves-dark white" onclick="deleteAnime('${doc.id}')"><i class="material-icons md-dark">delete</i></button>
                <button class="btn-floating waves-effect waves-dark white dropdown-trigger" data-target="dropdown-${doc.id.toLowerCase().replace(' ', '-')}"><i class="material-icons md-dark">more_vert</i></button>
              </div>
            </div>
            <ul id="dropdown-${doc.id.toLowerCase().replace(' ', '-')}" class="dropdown-content" style="width: 100px">
            <li><a role="button" onclick="moveTo('${doc.id}', '${data.nombre_en}' , '${data.generos}', '${data.salida}', '${data.imagen}' , 'viendo')">Mover a viendo</a></li>
            <li><a role="button" onclick="moveTo('${doc.id}', '${data.nombre_en}' , '${data.generos}', '${data.salida}', '${data.imagen}' , 'vistos')">Mover a vistos</a></li>
            <li><a role="button" onclick="moveTo('${doc.id}', '${data.nombre_en}' , '${data.generos}', '${data.salida}', '${data.imagen}' , 'favoritos')">Mover a favoritos</a></li>
            <li><a role="button" onclick="moveTo('${doc.id}', '${data.nombre_en}' , '${data.generos}', '${data.salida}', '${data.imagen}' , 'odiados')">Mover a odiados</a></li>
            </ul>
              `
    })
    document.getElementById(tabs.getSelectedTab()).innerHTML = template;
    ui.initDropdowns();
  });
}
module.exports = {
  deleteAnime,
  updateCards
}