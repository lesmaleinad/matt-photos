/**
 * @typedef {import('stripe').Stripe} Stripe
 * @typedef {import('stripe').Stripe.LineItem} LineItem
 * @typedef {import('stripe').Stripe.Address} Address
 * @typedef {import('stripe').Stripe.Checkout} Checkout
 * @typedef {import('stripe').Stripe.Product} Product
 * @typedef {import('stripe').Stripe.Checkout.Session} Session
 * @typedef {import('../server/prodigi/prodigi').OrderParams} OrderParams
 * @typedef {import('../server/prodigi/prodigi').Prodigi} Prodigi
 */

/** @type Stripe */
const stripe = require('stripe')(process.env.STRIPE_API_SECRET);

const {
    Prodigi,
    ShippingMethod,
    ItemSizing,
} = require('../server/prodigi/prodigi');

const prodigi = new Prodigi(
    process.env.PRODIGI_API_URL,
    process.env.PRODIGI_API_KEY
);

const STATUS_CODE = {
    OK: {
        statusCode: 200,
    },
};

/**
 * @returns {OrderParams}
 */
function sessionToOrderParams(
    /** @type Session */ session,
    /** @type Product[] */ products
) {
    const failures = [];
    const nonCriticalFailures = [];

    /**
     * @param {string} key
     * @param {any} value
     * @param {boolean} required
     * @returns any
     */
    function validate(key, value, required = true) {
        if (!!value) {
            return value;
        } else if (required) {
            failures.push({ key, value });
        } else {
            nonCriticalFailures.push({ key, value });
        }
    }

    /** @type Address */
    const address = validate('address', session.shipping.address);

    /** @type LineItem[] */
    const lineItems = validate('lineItems', session.line_items).data;

    /** @type OrderParams */
    const params = {
        shippingMethod: ShippingMethod.Standard,
        recipient: {
            name: validate('name', session.shipping.name),
            email: validate('email', session.customer.email, false),
            phoneNumber: validate('phoneNumber', session.customer.phone, false),
            address: {
                line1: validate('line1', address?.line1),
                line2: validate('line2', address?.line2, false),
                postalOrZipCode: validate(
                    'postalOrZipCode',
                    address?.postal_code
                ),
                townOrCity: validate('townOrCity', address?.city),
                stateOrCounty: validate('stateOrCounty', address?.state, false),
                countryCode: validate('countryCode', address?.country),
            },
        },
        items: lineItems.map((lineItem, index) => {
            const product = products.find(
                (product) => product.id === lineItem.price.product
            );
            return {
                sku: validate(
                    `lineItem-${index}-sku`,
                    lineItem.price.metadata['prodigi_sku']
                ),
                copies: validate(`lineItem-${index}-copies`, lineItem.quantity),
                sizing: ItemSizing.FillPrintArea,
                assets: [
                    {
                        printArea: 'default',
                        url: validate(
                            `lineItem-${index}-assets.url`,
                            product.images[0]
                        ),
                    },
                ],
            };
        }),
    };

    if (failures.length > 0) {
        console.error(failures);
        throw new Error('FAILED VALIDATION FOR SESSION: ' + session.id);
    } else {
        console.log('VALIDATION SUCCESS FOR SESSION: ' + session.id);
        if (nonCriticalFailures.length > 0) {
            console.warn('MINOR ERRORS');
            console.error(nonCriticalFailures);
        }
        return params;
    }
}

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
            const session = await stripe.checkout.sessions.retrieve(sessionId, {
                expand: ['line_items'],
            });
            const lineItems = session.line_items && session.line_items.data;
            if (lineItems) {
                console.log('--- PRINT LINE ITEMS ---');
                console.log(lineItems);
                console.log('_________________________');

                const products = await stripe.products.list();

                const orderParams = sessionToOrderParams(
                    session,
                    products.data
                );
                const order = await prodigi.createOrder(orderParams);
                console.log(order);
                return STATUS_CODE.OK;
            } else {
                console.error(session);
                throw new Error(
                    `No lineItems found for sessionId ${sessionId}`
                );
            }
        } else {
            console.error(data);
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
