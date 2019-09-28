function resizeColumns() {
  document.querySelectorAll('.col').forEach((col) => {
    col.style.height = window.innerHeight + 'px';
    col.style.paddingBottom = '100px';
  });
}

function initDropdowns() {
  var elems = document.querySelectorAll('.dropdown-trigger');
  if (elems) {
    var instances = M.Dropdown.init(elems, {
      constrainWidth: false
    });
  }
}

function mostrarBusqueda() {
  if (document.querySelector('#searchBox').value == "" || document.querySelector('#searchBox').value == null) {
    document.querySelector('#busqueda').style.display = 'none';
    document.getElementById(tabs.getSelectedTab()).style.visibility = 'visible';
  } else {
    document.querySelector('#busqueda').style.display = 'block';
    document.getElementById(tabs.getSelectedTab()).style.visibility = 'hidden';
  }
}
module.exports = {
  resizeColumns,
  initDropdowns,
  mostrarBusqueda
}