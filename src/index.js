import debounce from 'lodash.debounce';
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
// refs.inputRef.addEventListener('input', debounce(onInput, 500));
// const BASE_URL = ;
refs.form.addEventListener('submit', onSubmit);
// function onInput(e) {
//   query = e.target.value.trim();
//   console.log(query);
// }

function onSubmit(e) {
  e.preventDefault();
  query = refs.inputRef.value.trim();
  console.log(query);
  if (!query || query === '') {
    console.log('wron query');
    return;
  }
  renderImg();
  console.log(query);

  // console.log(query);
}

async function fetchImgs() {
  try {
    const response = await axios.get(
      `https://pixabay.com/api?key=33673211-c1a6432360cae6f7a6957d257&q=${query}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=false`
    );

    return response;
  } catch (error) {
    console.error(error);
  }
}
async function renderImg() {
  const response = await fetchImgs();
  if (response.data.total === 0) {
    document.body.insertAdjacentHTML(
      'beforeend',
      `<div style="text-align: center; padding-top: 200px"><h1 style="color: #777">There are no matches :(</h1></div>`
    );
    return;
  }
  createCard(response);
}

async function createCard(imgs) {
  console.log(imgs.data);
  const markup = imgs.data.hits
    .map(({ webformatURL, largeImageURL }) => {
      return `
      <article class="photo-card post grid__item " >
      <a href="${largeImageURL}" class="link">
      <img class="previewImg" src="${webformatURL}" alt="" loading="lazy" />
      </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
    </p>
    <p class="info-item">
      <b>Views</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
    </p>
  </div>
</article>
    `;
    })
    .join('');
  refs.container.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
  observer.observe(document.querySelector('.target'));
}

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5,
};

var observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('порадьте психолога');
      page += 1;
      console.log(page);
      renderImg();
    }
  });
}, options);

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
