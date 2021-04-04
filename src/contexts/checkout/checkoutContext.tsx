import { loadStripe } from '@stripe/stripe-js';
import { CartItem } from '../cart/cartContext';
import {
    provideStatefulContextToRoot,
    StatefulRootContext,
} from '../contextFactory';

const stripePromise = loadStripe(process.env.GATSBY_STRIPE_API_PUBLIC || '');

class Checkout extends StatefulRootContext<boolean> {
    public state: boolean = false;

    public openDialog() {
        this.setState(true);
    }

    public closeDialog() {
        this.setState(false);
    }

    public async startCheckout(items: CartItem[]) {
        const lineItems = items.map((item) => ({
            price: item['price']['id'],
            quantity: item['quantity'],
        }));

        const stripe = await stripePromise;

        if (stripe) {
            const error = await stripe.redirectToCheckout({
                mode: 'payment',
                successUrl: window.location.href,
                cancelUrl: window.location.href,
                lineItems: lineItems,
                shippingAddressCollection: { allowedCountries: ['US'] },
            });

            if (error) {
                console.error(error);
            }
        } else {
            console.error('stripe was never loaded!');
        }
    }
}

export const useCheckout = provideStatefulContextToRoot<boolean, Checkout>(
    new Checkout()
);
