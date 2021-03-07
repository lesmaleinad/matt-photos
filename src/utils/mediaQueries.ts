import { useMediaQuery } from '@material-ui/core';

export const useSizes = () => ({
    isSmall: useMediaQuery('(max-width: 600px)'),
    isLarge: useMediaQuery('(min-width: 1500px)'),
});
