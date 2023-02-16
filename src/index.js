import InfiniteScroll from 'infinite-scroll';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
var lightbox = new SimpleLightbox('.photo-card a', {});
const axios = require('axios').default;
const refs = {
  container: document.querySelector('.gallery'),
  form: document.querySelector('form'),
  imgRef: document.querySelector('.link'),
};
let query = null;
let page = 1;
// const BASE_URL = ;
refs.form.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  query = refs.form.elements.searchQuery.value;
  // console.log(query);
  renderImg();
}

async function fetchImgs() {
  try {
    const response = await axios.get(
      `https://pixabay.com/api?key=33673211-c1a6432360cae6f7a6957d257&q=${query}&page=${page}&per_page=20&image_type=photo&orientation=horizontal&safesearch=false`
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}
async function renderImg() {
  const response = await fetchImgs();
  createCard(response);
}

async function createCard(imgs) {
  console.log(imgs.data.hits);
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
  refs.container.innerHTML = markup;
  lightbox.refresh();
  var target = document.querySelectorAll('article').forEach(el => {
    observer.observe(el);
    // console.log('watching', el);
  });
  // console.log(target);
}
function increementPageValue() {
  page += 1;
}

const options = {
  root: null,
  rootMargin: '-250px 0px',
  threshold: 1,
};
var callback = function (entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('intersecting');
      console.log(entry.target);
    }
    // entry.time; // a DOMHightResTimeStamp indicating when the intersection occurred.
    // entry.rootBounds; // a DOMRectReadOnly for the intersection observer's root.
    // entry.boundingClientRect; // a DOMRectReadOnly for the intersection observer's target.
    // entry.intersectionRect; // a DOMRectReadOnly for the visible portion of the intersection observer's target.
    // entry.intersectionRatio; // the number for the ratio of the intersectionRect to the boundingClientRect.
    // entry.target; // the Element whose intersection with the intersection root changed.
    // entry.isIntersecting; // intersecting: true or false
  });
};
var observer = new IntersectionObserver(callback, options);

// let infScroll = new InfiniteScroll('.grid', {
//   // Infinite Scroll options...
//   path: fetchImgs(),
//   append: '.grid__item',
//   // outlayer: msnry,
// });
// let infScroll = new InfiniteScroll('.container', {
//   // defaults listed

//   path: increementPageValue(),
//   // REQUIRED. Determines the URL for the next page
//   // Set to selector string to use the href of the next page's link
//   // path: '.pagination__next'
//   // Or set with {{#}} in place of the page number in the url
//   // path: '/blog/page/{{#}}'
//   // or set with function
//   // path: function() {
//   //   return return '/articles/P' + ( ( this.loadCount + 1 ) * 10 );
//   // }

//   append: createCard(imgs),
//   // REQUIRED for appending content
//   // Appends selected elements from loaded page to the container

//   checkLastPage: true,
//   // Checks if page has path selector element
//   // Set to string if path is not set as selector string:
//   //   checkLastPage: '.pagination__next'

//   prefill: false,
//   // Loads and appends pages on intialization until scroll requirement is met.

//   responseBody: 'text',
//   // Sets the method used on the response.
//   // Set to 'json' to load JSON.

//   domParseResponse: true,
//   // enables parsing response body into a DOM
//   // disable to load flat text

//   fetchOptions: undefined,
//   // sets custom settings for the fetch() request
//   // for setting headers, cors, or POST method
//   // can be set to an object, or a function that returns an object

//   outlayer: false,
//   // Integrates Masonry, Isotope or Packery
//   // Appended items will be added to the layout

//   scrollThreshold: 400,
//   // Sets the distance between the viewport to scroll area
//   // for scrollThreshold event to be triggered.

//   elementScroll: false,
//   // Sets scroller to an element for overflow element scrolling

//   loadOnScroll: true,
//   // Loads next page when scroll crosses over scrollThreshold

//   history: 'replace',
//   // Changes the browser history and URL.
//   // Set to 'push' to use history.pushState()
//   //    to create new history entries for each page change.

//   historyTitle: true,
//   // Updates the window title. Requires history enabled.

//   hideNav: undefined,
//   // Hides navigation element

//   status: undefined,
//   // Displays status elements indicating state of page loading:
//   // .infinite-scroll-request, .infinite-scroll-load, .infinite-scroll-error
//   // status: '.page-load-status'

//   button: undefined,
//   // Enables a button to load pages on click
//   // button: '.load-next-button'

//   onInit: undefined,
//   // called on initialization
//   // useful for binding events on init
//   // onInit: function() {
//   //   this.on( 'append', function() {...})
//   // }

//   debug: false,
//   // Logs events and state changes to the console.
// });
