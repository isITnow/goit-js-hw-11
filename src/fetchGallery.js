import axios from 'axios';

async function fetchGallery(q, page) {
    const perPage = 40;
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '29319280-fde4903173ec234f4d94cddfd';
    const URL = `${BASE_URL}?key=${API_KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

    const response = await axios.get(URL);
    return response;
}

export { fetchGallery };

// const fetchImages = async (searching, page) => {
//     try {
//         const response = await axios.get(
//             `https://pixabay.com/api/?key=${API_KEY}&q=${searching}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
//         );
//         console.log(response);
//         return response.data;
//     } catch (error) {
//         console.log(error);
//     }
// };
