// import axios from 'axios';
import Notiflix from 'notiflix';
import { fetchGallery } from './fetchGallery.js';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-more'),
};
let page = 1;
let clientQuery = '';

refs.form.addEventListener('submit', onFormSubmit);

async function onFormSubmit(evt) {
  evt.preventDefault();
  refs.gallery.innerHTML = '';
  //   console.log(evt);
  //   console.log(evt.target.searchQuery.value);

  try {
    clientQuery = evt.target.searchQuery.value;
    const data = await fetchGallery(clientQuery, page);
    const dataArr = data.data.hits;
    if (dataArr.length === 0 || clientQuery === '') {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      refs.form.reset();
      return;
    }

    const totalImages = data.data.total;
    Notiflix.Notify.success(`Hooray! We found ${totalImages} images.`);
    createMarkup(dataArr);
  } catch (error) {
    alert('ERROR');
  }
}

// fetchGallery('car', 1).then(data => {
//   console.log(data);
//   console.log(data.data.totalHits);
//   console.log(data.data.hits);
// });

refs.loadBtn.addEventListener('click', onLoadBtnClick);

async function onLoadBtnClick(evt) {
  try {
    page += 1;
    const data = await fetchGallery(clientQuery, page);
    const dataArr = data.data.hits;
    createMarkup(dataArr);
  } catch (error) {}
}

function parseMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`
    )
    .join('');
}

function createMarkup(arr) {
  refs.gallery.insertAdjacentHTML('beforeend', parseMarkup(arr));
}