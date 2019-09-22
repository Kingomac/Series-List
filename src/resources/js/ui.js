function resizeColumns() {
  document.querySelectorAll('.col').forEach((col) => {
    col.style.height = window.innerHeight + 'px';
    col.style.paddingBottom = '100px';
  });
}

function initDropdowns() {
  var elems = document.querySelectorAll('.dropdown-trigger');
  var instances = M.Dropdown.init(elems, {
    constrainWidth: false
  });
}
module.exports = {
  resizeColumns,
  initDropdowns
}