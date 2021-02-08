const stripe = require('stripe')(process.env.STRIPE_API_SECRET);
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
