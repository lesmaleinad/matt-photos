import './App.css';
import React, { useEffect, useState } from 'react';
import { useStripe } from '../../contexts/Stripe/stripeContext';
import Stripe from 'stripe';
import Img from 'gatsby-image';
import { StripeProduct } from '../../types/stripe';
import { CartItem, useCart } from '../../contexts/cart/cartContext';

type Props = {
    pageContext: {
        stripeProducts: StripeProduct[];
    };
};

function App({ pageContext: { stripeProducts } }: Props) {
    const stripePromise = useStripe();
    const shoppingCart = useCart();

    const [cartItems, setCartItems] = useState<CartItem[]>(shoppingCart.items);

    async function startCheckout() {
        function toLineItems(items: CartItem[]) {
            return items.map((item) => ({
                price: item['price']['id'],
                quantity: item['quantity'],
            }));
        }

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

    function onQuantityChange(price: Stripe.Price, value: number) {
        shoppingCart.set(price, value);
        setCartItems(shoppingCart.items);
    }

    return (
        <div className="app">
            {stripeProducts.map((product) => (
                <div key={product.id}>
                    <p>id: {product.id}</p>
                    name: {product.name}
                    <Img fluid={product.localFiles[0].childImageSharp.fluid} />
                    <div>
                        {product.prices.map((price) => {
                            const cartItem = shoppingCart.getCartItemByPrice(
                                price
                            );

                            return (
                                <div key={price.id}>
                                    <p>sku: {price.nickname}</p>
                                    <p>
                                        price: $
                                        {price.unit_amount
                                            ? (
                                                  price.unit_amount / 100
                                              ).toLocaleString()
                                            : '???'}
                                    </p>
                                    <input
                                        type="number"
                                        value={
                                            cartItem ? cartItem['quantity'] : 0
                                        }
                                        onChange={(event) =>
                                            onQuantityChange(
                                                price,
                                                parseInt(event.target.value)
                                            )
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
            <button onClick={startCheckout}>Checkout</button>
        </div>
    );
}

export default App;
