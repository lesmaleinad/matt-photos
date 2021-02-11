import React from 'react';
import { rootContextProviders } from './src/contexts/contextFactory';

export const wrapRootElement = ({ element }) => {
    return rootContextProviders.reduce(
        (prevFn, currentFn) => {
            return () => currentFn({ children: prevFn() });
        },
        () => element
    )();
};
