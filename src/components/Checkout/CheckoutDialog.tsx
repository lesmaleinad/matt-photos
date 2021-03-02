import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Divider,
    Slide,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import React, { useEffect } from 'react';
import Stripe from 'stripe';
import Img from 'gatsby-image';
import { useCart } from '../../contexts/cart/cartContext';
import { useCheckout } from '../../contexts/checkout/checkoutContext';
import { StripePriceNode, StripeProductNode } from '../../types/stripe';
import { formattedCost, formattedPrice } from '../../utils/price';

interface CheckoutRow {
    photo: string;
    size: string;
    quantity: number;
    total: number;
}

const columns: string[] = ['Photo', 'Size', 'Quantity', 'Total'];

function createRow(
    photo: Stripe.Product,
    size: Stripe.Price,
    quantity: number
): CheckoutRow {
    return {
        photo: photo.name,
        size: size.nickname || 'UNKNOWN SIZE',
        quantity: quantity,
        total: (quantity * (size.unit_amount || 0)) / 100,
    };
}

interface Props {
    stripePrices: StripePriceNode[];
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function CheckoutDialog({ stripePrices }: Props) {
    const [shoppingCart, cartItems] = useCart();
    const [checkout, isCheckoutOpen] = useCheckout();

    const totalItems = shoppingCart.getTotalItems();

    useEffect(() => {
        if (totalItems === 0) {
            closeDialog();
        }
    });

    function getProduct(
        stripePrice: Stripe.Price
    ): StripeProductNode | undefined {
        return stripePrices.find((price) => price.id === stripePrice.id)
            ?.product;
    }

    function closeDialog() {
        checkout.closeDialog();
    }

    function addItem(price: Stripe.Price) {
        return () => shoppingCart.add(price);
    }

    function removeItem(price: Stripe.Price) {
        return () => shoppingCart.add(price, -1);
    }

    function startCheckout() {
        checkout.startCheckout(cartItems);
    }

    return (
        <Dialog
            TransitionComponent={Transition}
            fullWidth={true}
            open={isCheckoutOpen}
            onClose={closeDialog}
            PaperProps={{
                style: {
                    height: 600,
                },
            }}
        >
            <DialogContent>
                {cartItems.map(({ price, quantity }) => {
                    const product = getProduct(price);
                    return (
                        product && (
                            <div key={price.id.toString()}>
                                <div style={{ display: 'flex' }}>
                                    <div style={{ flexShrink: 0 }}>
                                        <Img
                                            style={{
                                                borderRadius: 4,
                                            }}
                                            fluid={
                                                product.localFiles[0]
                                                    .childImageSharp.fluid!
                                            }
                                        />
                                        <div
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                            }}
                                        >
                                            <Button onClick={removeItem(price)}>
                                                -
                                            </Button>
                                            <Button onClick={addItem(price)}>
                                                +
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <div>Name: {product.name}</div>
                                        <div>Size: {price.nickname}</div>
                                        <div>
                                            Price: {formattedPrice(price)}
                                        </div>
                                        <span>Quantity: {quantity}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    );
                })}
                <div>TOTAL: {formattedCost(shoppingCart.getTotalPrice())}</div>
            </DialogContent>
            <Divider />
            <DialogActions>
                <div>Total items: {totalItems}</div>
                <Button disabled={totalItems === 0} onClick={startCheckout}>
                    Checkout
                </Button>
            </DialogActions>
        </Dialog>
    );
}
