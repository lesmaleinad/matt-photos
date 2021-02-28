import Stripe from 'stripe';

export function formattedPrice(price: Stripe.Price) {
    return formattedCost(price.unit_amount);
}

export function formattedCost(number: number | null) {
    return '$' + (number ? (number / 100).toLocaleString() : '???');
}
