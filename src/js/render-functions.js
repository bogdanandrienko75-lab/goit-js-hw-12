import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import 'loaders.css/loaders.min.css';

const galleryContainer = document.querySelector('#gallery');
const loaderElement = document.querySelector('.gallery-actions .loader');
const loadMoreButton = document.querySelector('.load-more-button');
const lightbox = new SimpleLightbox('#gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function createGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
        <li class="photo-card">
          <a class="photo-link" href="${largeImageURL}">
            <img class="photo-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
          <div class="info">
            <p><b>Likes</b><span>${likes}</span></p>
            <p><b>Views</b><span>${views}</span></p>
            <p><b>Comments</b><span>${comments}</span></p>
            <p><b>Downloads</b><span>${downloads}</span></p>
          </div>
        </li>
      `
    )
    .join('');

  galleryContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

export function clearGallery() {
  galleryContainer.innerHTML = '';
}

export function showLoader() {
  loaderElement.classList.add('is-visible');
}

export function hideLoader() {
  loaderElement.classList.remove('is-visible');
}

export function showLoadMoreButton() {
  loadMoreButton.classList.remove('is-hidden');
  loadMoreButton.disabled = false;
}

export function hideLoadMoreButton() {
  loadMoreButton.classList.add('is-hidden');
  loadMoreButton.disabled = true;
}
