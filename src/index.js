import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
var lightbox = new SimpleLightbox('.photo-card a', {});
const axios = require('axios').default;
const refs = {
  container: document.querySelector('.gallery'),
  form: document.querySelector('form'),
  imgRef: document.querySelector('.link'),
  inputRef: document.querySelector('input'),
};
let query = '';
let page = 1;
const perPage = 20;

refs.form.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  page = 1;
  resetContainer();
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
}

async function fetchImgs() {
  try {
    const response = await axios.get(
      `https://pixabay.com/api?key=33673211-c1a6432360cae6f7a6957d257&q=${query}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true&min_width=320&min_height=240`
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}
async function renderImg() {
  const response = await fetchImgs();

  if (response.data.total === 0) {
    document
      .querySelector('.failure-title')
      .insertAdjacentHTML(
        'beforeend',
        `<h1 class="error-title">There are no matches :(</h1>`
      );
  }
  createCard(response);
  if (page === 1) {
    showTotalHints(response);
  }

  if (page !== 1) {
    smothScroll();
  }
  increasePageValue();
}

async function createCard(imgs) {
  console.log(imgs.data);
  const markup = imgs.data.hits
    .map(
      ({ webformatURL, largeImageURL, likes, comments, downloads, views }) => {
        return `
      <article class="photo-card post grid__item " >
      <a href="${largeImageURL}" class="link">
      <img class="previewImg" src="${webformatURL}" alt="" loading="lazy" />
      </a>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</article>
    `;
      }
    )
    .join('');
  refs.container.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
  observer.observe(document.querySelector('.target'));
}

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1,
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
    top: cardHeight * 1.5,
    behavior: 'smooth',
  });
}
function increasePageValue() {
  page += 1;
}
// написать скрипт для меншої кількості постів ніж 20

// var intersectionObserver = new IntersectionObserver(entries => {
//   if (entries[0].intersectionRatio <= 0) return;
//   const T = entries.forEach(entry => entry.target);
//   page += 1;
//   fetchImgs();
//   // console.log('Loaded new items');
// }, options);

// window.addEventListener('scroll', () => {
//   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
//   // fdvsd

//   if (scrollTop + clientHeight >= scrollHeight) {
//     page += 1;
//     renderImg();
//   }
//   // fsvsdfvsdf
// });

// function windowScroll() {
//   window.scrollBy({
//     top: cardHeight,
//     behavior: 'smooth',
//   });
// }

// if (page >= 2) {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .getBoundingClientRect();
//   windowScroll(cardHeight);
// }
