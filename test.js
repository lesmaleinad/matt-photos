const stripe = require('stripe')(process.env.STRIPE_API_SECRET);

async function printLineItems(data) {
    console.log('--- PRINT LINE ITEMS ---');
    console.log(data);
    console.log('_________________________');

    const lineItems = await stripe.checkout.sessions.listLineItems(
        JSON.parse(data)['object']['id']
    );

    console.log(lineItems);

    lineItems.forEach((lineItem) => {
        console.log('Nickname: ', lineItem.price.nickname);
        console.log('Quantity: ', lineItem.quantity);
    });
}

module.exports.printLineItems = printLineItems;
