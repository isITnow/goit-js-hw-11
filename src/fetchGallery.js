import axios from 'axios';

async function fetchGallery(q, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '29319280-fde4903173ec234f4d94cddfd';
  const URL = `${BASE_URL}?key=${API_KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  const response = await axios.get(URL);
  return response;
}

export { fetchGallery };
