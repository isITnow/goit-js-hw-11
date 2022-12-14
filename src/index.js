import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchGallery } from './fetchGallery.js';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
    form: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    sentinel: document.querySelector('.js-sentinel'),
};

let page;
let clientQuery = '';

refs.form.addEventListener('submit', onFormSubmit);

async function onFormSubmit(evt) {
    evt.preventDefault();
    page = 1;
    refs.gallery.innerHTML = '';

    try {
        clientQuery = evt.target.searchQuery.value;
        const data = await fetchGallery(clientQuery, page);
        const dataArr = data.data.hits;
        observer.observe(refs.sentinel);
        if (dataArr.length === 0 || clientQuery === '') {
            observer.unobserve(refs.sentinel);
            Notiflix.Notify.failure(
                'Sorry, there are no images matching your search query. Please try again.',
            );
            refs.form.reset();
            return;
        }

        const totalImages = data.data.totalHits;
        Notiflix.Notify.success(`Hooray! We found ${totalImages} images.`);
        createMarkup(dataArr);
    } catch (error) {
        error => console.log(error.message);
    }
}

const options = {
    root: null,
    rootMargin: '200px',
    threshold: 1,
};
const observer = new IntersectionObserver(updateGallery, options);

function updateGallery(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            page += 1;
            fetchGallery(clientQuery, page)
                .then(data => {
                    const dataArr = data.data.hits;
                    createMarkup(dataArr);
                    if (data.data.totalHits < page * 40) {
                        Notiflix.Notify.warning(
                            "We're sorry, but you've reached the end of search results.",
                        );
                        refs.form.reset();
                        observer.unobserve(refs.sentinel);
                    }
                })
                .catch(error => console.log(error.message));
        }
    });
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
            }) => `<div class="photo-card"><img src="${webformatURL}" alt="${tags}" loading="lazy" class="img" height="400"/>                            <div class="info">
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
