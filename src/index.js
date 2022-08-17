import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchGallery } from './fetchGallery.js';

const refs = {
    form: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    loadBtn: document.querySelector('.load-more'),
};
let page;
let clientQuery = '';
refs.loadBtn.classList.add('js__is-hidden');

refs.form.addEventListener('submit', onFormSubmit);

async function onFormSubmit(evt) {
    evt.preventDefault();
    page = 1;
    refs.gallery.innerHTML = '';

    try {
        clientQuery = evt.target.searchQuery.value;
        const data = await fetchGallery(clientQuery, page);
        const dataArr = data.data.hits;
        if (dataArr.length === 0 || clientQuery === '') {
            Notiflix.Notify.failure(
                'Sorry, there are no images matching your search query. Please try again.',
            );
            refs.form.reset();
            return;
        }

        const totalImages = data.data.total;
        Notiflix.Notify.success(`Hooray! We found ${totalImages} images.`);
        createMarkup(dataArr);
        refs.loadBtn.classList.remove('js__is-hidden');
    } catch (error) {
        error => console.log(error.message);
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

        if (data.data.totalHits < page * perPge) {
            Notiflix.Notify.warning(
                "We're sorry, but you've reached the end of search results.",
            );
            refs.loadBtn.classList.add('js__is-hidden');
        }
    } catch (error) {
        error => console.log(error.message);
    }
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
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="img"/>
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
</div>`,
        )
        .join('');
}

function createMarkup(arr) {
    refs.gallery.insertAdjacentHTML('beforeend', parseMarkup(arr));
}
