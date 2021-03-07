import React from 'react';
import { Button } from '@material-ui/core';
import { useCart } from '../../contexts/cart/cartContext';
import { useCheckout } from '../../contexts/checkout/checkoutContext';
import { useSizes } from '../../utils/mediaQueries';

export default function CheckoutEntry() {
    const { isLarge } = useSizes();
    const [shoppingCart] = useCart();
    const [checkout] = useCheckout();
    const totalItems = shoppingCart.getTotalItems();

    function openCheckoutDialog() {
        checkout.openDialog();
    }

    return (
        <div
            style={{
                zIndex: 1,
                position: 'fixed',
                top: `calc(100% - ${isLarge ? 75 : 50}px)`,
                left: `calc(100% - ${isLarge ? 225 : 150}px)`,
            }}
        >
            {totalItems > 0 && (
                <Button
                    style={{
                        fontSize: isLarge ? '1.5rem' : '1rem',
                        backgroundColor: 'black',
                        color: 'white',
                    }}
                    onClick={openCheckoutDialog}
                >
                    Checkout ({totalItems})
                </Button>
            )}
        </div>
    );
}
