import React from 'react';
import { rootContextProviders } from './src/contexts/contextFactory';

export const wrapRootElement = ({ element }) => {
    return rootContextProviders.reduce((PreviousElement, CurrentElement) => {
        return <CurrentElement>{PreviousElement}</CurrentElement>;
    }, element);
};
