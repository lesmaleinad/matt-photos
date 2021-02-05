import { loadStripe, Stripe } from '@stripe/stripe-js';
import React, { createContext, useContext } from 'react';

const stripePromise = loadStripe(
    'pk_test_51IDCTNA5W2SKE4KYHiJrnhLlddu0LUx6l44c5iVJBy0Wulhw96RWBJs2XJwWkQzwIR6aFwh0VFStH4QsmXfbyJew00aZZHCTE2'
);

const StripeContext = createContext<Promise<Stripe | null>>(stripePromise);

type Props = {
    children: React.ReactNode;
};

export const StripeProvider = ({ children }: Props) => {
    return (
        <StripeContext.Provider value={stripePromise}>
            {children}
        </StripeContext.Provider>
    );
};

export const useStripe = () => {
    return useContext(StripeContext);
};
