import React from 'react';
import { StripeProvider } from './src/integrations/Stripe/stripeContext';

export const wrapRootElement = ({ element }) => {
    <StripeProvider>{element}</StripeProvider>;
};
