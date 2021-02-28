import { CssBaseline } from '@material-ui/core';
import React from 'react';
import { rootContextProviders } from './src/contexts/contextFactory';

// Keep in sync with gatsby-browser.js

export const wrapRootElement = ({ element }) => {
    return rootContextProviders.reduce((PreviousElement, CurrentElement) => {
        return <CurrentElement>{PreviousElement}</CurrentElement>;
    }, <CssBaseline>{element}</CssBaseline>);
};
