export default (product) => {
    // console.log(product);/s
    // console.log(product);
    if (product.expand && product.expand['product_ratings(product_id)']) {
        const ratingsTotal = product.expand['product_ratings(product_id)'].reduce((acc, current) => (acc += current.star_rating), 0);
        const ratingsAmount = product.expand['product_ratings(product_id)'].length;
        return { rating: ratingsTotal / ratingsAmount, ratingsAmount };
    }
};
