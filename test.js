const stripe = require('stripe')(
    'sk_test_51IDCTNA5W2SKE4KYT2h2vdNZoLHdfbsOKB4ZT2bFDImIPnQcQwGXyQBl5HlwbMDW421Zu0UwW6WHKTNbhnWYhxR000l6kreNAt'
);

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
