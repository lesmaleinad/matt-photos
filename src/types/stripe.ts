import { Stripe } from 'stripe';
import { StripeProductNode } from '../pages';

export interface StripeProduct extends StripeProductNode {
    prices: Stripe.Price[];
}
