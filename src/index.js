const axios = require('axios').default;
const refs = {
  container: document.querySelector('.gallery'),
  form: document.querySelector('form'),
};
let query = null;
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
      `https://pixabay.com/api?key=33673211-c1a6432360cae6f7a6957d257&q=${query}&page=1&per_page=20&image_type=photo&orientation=horizontal&safesearch=false`
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
    .map(({ previewURL }) => {
      return `
      <div class="photo-card">
  <img src="${previewURL}" alt="" loading="lazy" />
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
</div>
    `;
    })
    .join('');
  refs.container.innerHTML = markup;
}
