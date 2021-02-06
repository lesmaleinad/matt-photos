const stripe = require('stripe')(
    'sk_test_51IDCTNA5W2SKE4KYT2h2vdNZoLHdfbsOKB4ZT2bFDImIPnQcQwGXyQBl5HlwbMDW421Zu0UwW6WHKTNbhnWYhxR000l6kreNAt'
);

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
