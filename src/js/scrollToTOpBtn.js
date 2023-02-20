import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import { refs } from './refs';
export function showHideToTheUpBtn() {
  window.addEventListener(
    'scroll',
    throttle(() => {
      if (window.pageYOffset > 400) {
        refs.scrollToTop.style.display = 'flex';
      } else {
        refs.scrollToTop.style.display = 'none';
        console.log('you are scrolling');
      }
    }, 500)
  );
}
export function scrollToTop() {
  refs.scrollToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

export default { showHideToTheUpBtn, scrollToTop };
