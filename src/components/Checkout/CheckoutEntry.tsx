import React from 'react';
import { Button } from '@material-ui/core';
import { useCart } from '../../contexts/cart/cartContext';
import { useCheckout } from '../../contexts/checkout/checkoutContext';

export default function CheckoutEntry() {
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
                top: 'calc(100% - 50px)',
                left: 'calc(100% - 150px)',
            }}
        >
            {totalItems > 0 && (
                <Button
                    style={{ backgroundColor: 'black', color: 'white' }}
                    onClick={openCheckoutDialog}
                >
                    Checkout ({totalItems})
                </Button>
            )}
        </div>
    );
}
