import { loadStripe, Stripe } from '@stripe/stripe-js';
import provideContextToRoot from '../contextFactory';

const stripePromise = loadStripe(
    'pk_test_51IDCTNA5W2SKE4KYHiJrnhLlddu0LUx6l44c5iVJBy0Wulhw96RWBJs2XJwWkQzwIR6aFwh0VFStH4QsmXfbyJew00aZZHCTE2'
);

export const useStripe = provideContextToRoot<Promise<Stripe | null>>(
    stripePromise
);
