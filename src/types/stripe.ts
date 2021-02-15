import { FixedObject, FluidObject } from 'gatsby-image';
import { Stripe } from 'stripe';

export interface StripeProductNode extends Stripe.Product {
    localFiles: {
        childImageSharp: {
            fixed?: FixedObject;
            fluid?: FluidObject;
        };
    }[];
}

export interface StripePriceNode extends Stripe.Price {
    product: StripeProductNode;
}

export interface StripeProduct extends StripeProductNode {
    prices: Stripe.Price[];
}
