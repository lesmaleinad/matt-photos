/**
 * @type import('stripe').Stripe
 * */
const stripe = require('stripe')(process.env.STRIPE_API_SECRET);

const STATUS_CODE = {
    OK: {
        statusCode: 200,
    },
};

/**
 * @param {import('aws-lambda').APIGatewayEvent} event
 * @param {import('aws-lambda').Context} context
 * */
async function handler(event, context) {
    try {
        const body = JSON.parse(event.body) || {};
        const data = body['data'] || {};
        const object = data['object'] || {};
        const sessionId = object['id'];
        if (sessionId) {
            const lineItemsData = await stripe.checkout.sessions.listLineItems(
                sessionId
            );
            console.log('--- PRINT LINE ITEMS ---');
            console.log(lineItemsData);
            console.log('_________________________');

            const lineItems = lineItemsData['data'];

            lineItems.forEach((lineItem) => {
                console.log('Nickname: ', lineItem.price.nickname);
                console.log('Quantity: ', lineItem.quantity);
            });
            return STATUS_CODE.OK;
        } else {
            throw new Error('No SessionID found on the event object!');
        }
    } catch (e) {
        console.error(e);
        console.error(event);
        console.error(context);
        return STATUS_CODE.OK;
    }
}

exports.handler = handler;
