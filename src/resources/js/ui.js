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

var filters = [{ name: 'Fecha de actualización', value: 'actualizado_en' }, { name: 'Nombre japonés', value: 'nombre_jp' }, { name: 'Nombre inglés', value: 'nombre_en' }];

function initFilterSelect() {
  let template = '';
  ui.filters.forEach((item) => {
    template += //html
      `
    <option value="${item.value}">${item.name}</option>
    `
  })
  document.getElementById('filterSelect').innerHTML = template;
  refreshFilters();
}

function refreshFilters() {
  M.FormSelect.init(document.querySelectorAll('select'), {
    dropdown: {
      constrainWidth: true
    }
  });
}

function getSelectedFilter() {
  refreshFilters();
  return document.querySelector('select').M_FormSelect.getSelectedValues();
}
module.exports = {
  resizeColumns,
  initDropdowns,
  mostrarBusqueda,
  initFilterSelect,
  filters,
  getSelectedFilter
}