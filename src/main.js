import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const loadMoreButton = document.querySelector('.load-more-button');
const galleryContainer = document.querySelector('#gallery');

let currentQuery = '';
let currentPage = 1;
const PER_PAGE = 15;

form.addEventListener('submit', onSearchSubmit);
loadMoreButton.addEventListener('click', onLoadMoreClick);

async function onSearchSubmit(event) {
  event.preventDefault();

  const query = event.currentTarget.elements['search-text'].value.trim();

  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search term.',
      position: 'topRight',
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;

  clearGallery();
  hideLoadMoreButton();
  await fetchImages();
}

async function onLoadMoreClick() {
  currentPage += 1;
  await fetchImages();
  scrollGallery();
}

async function fetchImages() {
  showLoader();

  try {
    const responseData = await getImagesByQuery(currentQuery, currentPage);
    const hits = Array.isArray(responseData.hits) ? responseData.hits : [];
    const totalHits = Number(responseData.totalHits) || 0;

    if (hits.length === 0) {
      if (currentPage === 1) {
        iziToast.info({
          title: 'No results',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
        });
      } else {
        hideLoadMoreButton();
        iziToast.info({
          title: 'End of results',
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topRight',
        });
      }
      return;
    }

    createGallery(hits);

    if (currentPage === 1) {
      iziToast.success({
        title: 'Success',
        message: `Found ${totalHits} images for "${currentQuery}".`,
        position: 'topRight',
      });
    }

    const totalPages = Math.ceil(totalHits / PER_PAGE);

    if (currentPage >= totalPages) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'End of results',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch {
    iziToast.error({
      title: 'Error',
      message: 'Unable to load images. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

function scrollGallery() {
  const firstCard = galleryContainer.querySelector('.photo-card');

  if (!firstCard) {
    return;
  }

  const { height } = firstCard.getBoundingClientRect();

  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}
