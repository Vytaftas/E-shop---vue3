import NoImage from '../assets/no-image.png';

export default (id, imageUrl, realURL = false) => {
    const url = `https://my-shop-app.pockethost.io/api/files/products/${id}/${imageUrl}`;

    const bgImage = { backgroundImage: imageUrl ? `url('${url}')` : `url('${NoImage}')` };

    return realURL ? url : bgImage;
};
