const stripe = require('stripe')(
    'sk_test_51IDCTNA5W2SKE4KYT2h2vdNZoLHdfbsOKB4ZT2bFDImIPnQcQwGXyQBl5HlwbMDW421Zu0UwW6WHKTNbhnWYhxR000l6kreNAt'
);
const path = require('path');

exports.createPages = async ({ actions: { createPage } }) => {
    async function getProductWithPrices(product) {
        const productPrices = await stripe.prices.list({
            product: product.id,
        });
        return {
            ...product,
            prices: productPrices.data,
        };
    }

    const productsArray = await stripe.products.list();
    const stripeProducts = await Promise.all(
        productsArray.data.map(getProductWithPrices)
    );

    console.log(stripeProducts);

    createPage({
        path: '/',
        component: path.resolve('src/components/App/App.tsx'),
        context: { stripeProducts },
    });
};
