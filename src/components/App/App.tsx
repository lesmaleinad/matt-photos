import './App.css';
import React from 'react';
import { useStripe } from '../../integrations/Stripe/stripeContext';
import { ChangeEvent, useState } from 'react';
import { StripeProduct } from '../../types/stripe';
import Stripe from 'stripe';

type CartItem = {
    price: Stripe.Price;
    quantity: number;
};

function toLineItems(items: CartItem[]) {
    return items.map((item) => ({
        price: item.price.id.toString(),
        quantity: item.quantity,
    }));
}

type Props = {
    pageContext: {
        stripeProducts: StripeProduct[];
    };
};

function App({ pageContext: { stripeProducts } }: Props) {
    const stripePromise = useStripe();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    async function handleClick() {
        console.log(cartItems);
        const stripe = await stripePromise;

        if (stripe) {
            const error = await stripe.redirectToCheckout({
                mode: 'payment',
                successUrl: window.location.href,
                cancelUrl: window.location.href,
                lineItems: toLineItems(cartItems),
                shippingAddressCollection: { allowedCountries: ['US'] },
            });

            if (error) {
                console.error(error);
            }
        } else {
            console.error('stripe was never loaded!');
        }
    }

    function getCartItemByPrice(price: Stripe.Price): CartItem | undefined {
        return cartItems.find((cartItem) => cartItem.price === price);
    }

    function onQuantityChange(newQuantity: number, price: Stripe.Price) {
        const newCartItems = cartItems.slice();
        const prevCartItemIndex = cartItems.findIndex(
            (cartItem) => cartItem.price === price
        );

        if (newQuantity > 0) {
            const newCartItem: CartItem = {
                price,
                quantity: newQuantity,
            };
            if (prevCartItemIndex > -1) {
                newCartItems[prevCartItemIndex] = newCartItem;
            } else {
                newCartItems.push(newCartItem);
            }
        } else if (prevCartItemIndex > -1) {
            newCartItems.splice(prevCartItemIndex, 1);
        }

        setCartItems(newCartItems);
    }

    return (
        <div className="app">
            {stripeProducts.map((product) => (
                <div key={product.id}>
                    <p>id: {product.id}</p>
                    name: {product.name}
                    <img
                        style={{
                            width: 300,
                            height: 200,
                        }}
                        src={product.images[0]}
                    ></img>
                    <div>
                        {product.prices.map((price) => {
                            const cartItem = getCartItemByPrice(price);

                            return (
                                <div key={price.id}>
                                    <p>sku: {price.nickname}</p>
                                    <p>
                                        price: $
                                        {price.unit_amount_decimal?.slice(
                                            0,
                                            -2
                                        )}
                                    </p>
                                    <input
                                        type="number"
                                        value={cartItem?.quantity || 0}
                                        onChange={(event) =>
                                            onQuantityChange(
                                                parseInt(event.target.value),
                                                price
                                            )
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
            <button onClick={handleClick}>Checkout</button>
        </div>
    );
}

export default App;
