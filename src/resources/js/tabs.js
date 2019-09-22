function getSelectedTab() {
  const sections = document.querySelectorAll('.section');
  let result = null;
  sections.forEach(e => {
    if (e.style.display == 'inline-block') {
      result = e.id;
    }
  });
  return result;
}

function changeTab(target) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(e => {
    if (e.id == target) {
      e.style.display = 'inline-block';
    } else {
      e.style.display = 'none';
    }
  });
  controller.updateCards();
}
module.exports = {
  getSelectedTab,
  changeTab
}