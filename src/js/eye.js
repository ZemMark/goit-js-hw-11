const eye = document.querySelector('path');
eye.addEventListener('mouseenter', changeBgc);
function changeBgc(e) {
  e.target.style.fill = '#000';
}
