const stripe = require('stripe')(process.env.STRIPE_API_SECRET);

exports.handler = async function (event, context) {
    const lineItemsData = await stripe.checkout.sessions.listLineItems(
        JSON.parse(event.body)['data']['object']['id']
    );

    console.log('--- PRINT LINE ITEMS ---');
    console.log(lineItemsData);
    console.log('_________________________');

    const lineItems = lineItemsData['data'];

    lineItems.forEach((lineItem) => {
        console.log('Nickname: ', lineItem.price.nickname);
        console.log('Quantity: ', lineItem.quantity);
    });
    return {
        statusCode: 200,
    };
};
