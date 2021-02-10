import './App.css';
import React from 'react';
import { useStripe } from '../../integrations/Stripe/stripeContext';
import Stripe from 'stripe';
import {
    Storage,
    StorageKey,
} from '../../integrations/localStorage/storage.service';
import Img from 'gatsby-image';
import { StripeProduct } from '../../types/stripe';

type CartItem = {
    ['price']: Stripe.Price;
    ['quantity']: number;
};

type Props = {
    pageContext: {
        stripeProducts: StripeProduct[];
    };
};

function App({ pageContext: { stripeProducts } }: Props) {
    function getInitialCartItems(): CartItem[] {
        return (Storage.get(StorageKey.CartItems)?.parse() ?? []) as CartItem[];
    }

    const stripePromise = useStripe();
    const [cartItems, setCartItems] = React.useState<CartItem[]>(
        getInitialCartItems
    );

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

    function getCartItemByPrice(price: Stripe.Price): CartItem | undefined {
        return cartItems.find(
            (cartItem) => cartItem['price']['id'] === price['id']
        );
    }

    function onQuantityChange(newQuantity: number, price: Stripe.Price) {
        const newCartItems = cartItems.slice();
        const prevCartItemIndex = cartItems.findIndex(
            (cartItem) => cartItem['price']['id'] === price['id']
        );

        if (newQuantity > 0) {
            const newCartItem: CartItem = {
                ['price']: price,
                ['quantity']: newQuantity,
            };
            if (prevCartItemIndex > -1) {
                newCartItems[prevCartItemIndex] = newCartItem;
            } else {
                newCartItems.push(newCartItem);
            }
        } else if (prevCartItemIndex > -1) {
            newCartItems.splice(prevCartItemIndex, 1);
        }

        Storage.set(StorageKey.CartItems, JSON.stringify(newCartItems));
        setCartItems(newCartItems);
    }

    return (
        <div className="app">
            {stripeProducts.map((product) => (
                <div key={product.id}>
                    <p>id: {product.id}</p>
                    name: {product.name}
                    <Img
                        style={{ width: 600, height: 400 }}
                        fluid={product.localFiles[0].childImageSharp.fluid}
                    />
                    <div>
                        {product.prices.map((price) => {
                            const cartItem = getCartItemByPrice(price);

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
            <button onClick={startCheckout}>Checkout</button>
        </div>
    );
}

export default App;
