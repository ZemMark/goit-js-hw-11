import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { comments, likes, views, downloads } from './js/svgRefs';
// import './js/scrollBtn';
var lightbox = new SimpleLightbox('.photo-card a', {});
import axios from 'axios';
// const axios = require('axios/dist/browser/axios.cjs');
const refs = {
  container: document.querySelector('.gallery'),
  form: document.querySelector('form'),
  imgRef: document.querySelector('.link'),
  inputRef: document.querySelector('input'),
  spinner: document.querySelector('.text-center'),
  failureTitleRef: document.querySelector('.failure-title'),
  submitBtn: document.querySelector('#submit'),
};
let query = '';
let page = 1;
const perPage = 20;

refs.form.addEventListener('submit', onSubmit);
// refs.submitBtn.onclick = () => {

// };
function onSubmit(e) {
  e.preventDefault();
  page = 1;
  resetContainer();
  // document.querySelector('.gallery').scrollIntoView({ behavior: 'smooth' });

  // window.location.hash = 'gallery';
  // $(function () {
  //   $.scrollify({
  //     section: '.gallery',
  //   });
  // });
  console.log('this should be 1' + ': ' + page);

  query = refs.inputRef.value.trim();
  console.log(query);
  refs.inputRef.blur();
  if (!query || query === '') {
    console.log('wron query');
    return;
  }
  renderImg();
  killSubmitButton();
  // showTotalHints(response);
}

async function fetchImgs() {
  try {
    const response = await axios.get(
      `https://pixabay.com/api?key=33673211-c1a6432360cae6f7a6957d257&q=${query}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true&min_width=320&min_height=220`
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}
async function renderImg() {
  showLoader();
  const response = await fetchImgs();
  console.log(response);

  if (response.data.total === 0) {
    hideLoader();
    document
      .querySelector('.failure-title')
      .insertAdjacentHTML(
        'beforeend',
        `<h1 class="error-title">There are no matches :(</h1>`
      );
    return;
  }
  createCard(response);
  smothScroll();
  increasePageValue();
  hideLoader();
  lightbox.refresh();

  // showEndOfPhotosWarning();
}

async function createCard({ data }) {
  console.log(data);
  const markup = data.hits
    .map(
      ({ webformatURL, largeImageURL, likes, comments, downloads, views }) => {
        return `
      <article class="photo-card post grid__item " >
      <a href="${largeImageURL}" class="link overlay">
      <img class="previewImg" src="${webformatURL}" alt="" loading="lazy" />
      </a>
  <div class="info">
    <div class="info-item">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" class="bi bi-heart" viewBox="0 0 16 16">
  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
</svg>
      <b>${likes}</b>
    </div>
    <div class="info-item">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" class="bi bi-eye" viewBox="0 0 16 16">
  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
</svg>
      <b>${views}</b>
    </div>
    <div class="info-item">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" class="bi bi-chat-dots" viewBox="0 0 16 16">
  <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
  <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"/>
</svg>
      <b>${comments}</b>
    </div>
    <div class="info-item">
    <svg class="rotate" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" class="bi bi-capslock" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M7.27 1.047a1 1 0 0 1 1.46 0l6.345 6.77c.6.638.146 1.683-.73 1.683H11.5v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1H1.654C.78 9.5.326 8.455.924 7.816L7.27 1.047zM14.346 8.5 8 1.731 1.654 8.5H4.5a1 1 0 0 1 1 1v1h5v-1a1 1 0 0 1 1-1h2.846zm-9.846 5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1zm6 0h-5v1h5v-1z"/>
</svg>
      <b>${downloads}</b>
    </div>
  </div>
</article>
    `;
      }
    )
    .join('');
  refs.container.insertAdjacentHTML('beforeend', markup);
  observer.observe(document.querySelector('.target'));
  const cards = document.querySelectorAll('article');
  console.log(cards.length);
  // showTotalHints(cards, data);
}

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 1,
};

var observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('порадьте психолога');
      console.log(page);
      renderImg();
    }
  });
}, options);

function resetContainer() {
  refs.container.innerHTML = '';
  document.querySelector('.failure-title').innerHTML = '';
}
function showTotalHints(response) {
  Notify.info('we found' + ' ' + response.data.total + ' ' + 'images');
}
function killSubmitButton() {
  refs.form.elements.submit.disabled = true;
}
refs.inputRef.addEventListener('input', onInput);
function onInput() {
  refs.form.elements.submit.disabled = false;
}
function smothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 3,
    behavior: 'smooth',
  });
}
function increasePageValue() {
  page += 1;
}
function hideLoader() {
  refs.spinner.classList.add('spinner-hidden');

  refs.spinner.addEventListener('transitioned', () => {
    document.body.removeChild('spinner-border');
  });
}
function showLoader() {
  refs.spinner.classList.remove('spinner-hidden');
}
// Get the button:
// let mybutton = document.getElementById('myBtn');

// When the user scrolls down 20px from the top of the document, show the button
// window.onscroll = function () {
//   scrollFunction();
// };

// function scrollFunction() {
//   if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
//     mybutton.style.display = 'block';
//   } else {
//     mybutton.style.display = 'none';
//   }
// }

// When the user clicks on the button, scroll to the top of the document
// function topFunction() {
//   document.body.scrollTop = 0; // For Safari
//   document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
// }

// $.scrollify({
//   section: '.example-classname',
//   sectionName: 'section-name',
//   interstitialSection: '',
//   easing: 'easeOutExpo',
//   scrollSpeed: 1100,
//   offset: 0,
//   scrollbars: true,
//   standardScrollElements: '',
//   setHeights: true,
//   overflowScroll: true,
//   updateHash: true,
//   touchScroll: true,
//   before: function () {},
//   after: function () {},
//   afterResize: function () {},
//   afterRender: function () {},
// });
