import Stripe from 'stripe';

export function photoPageLink(product: Stripe.Product): string {
    return `gallery/${product.name.toLowerCase().replace(/ /g, '-')}/`;
}
