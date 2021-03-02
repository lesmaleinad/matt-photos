import { graphql } from 'gatsby';
import React, { useState } from 'react';
import Img from 'gatsby-image';
import { StripePriceNode, StripeProductNode } from '../../types/stripe';
import { useCart } from '../../contexts/cart/cartContext';
import { Button, MenuItem, Select } from '@material-ui/core';
import Stripe from 'stripe';
import { formattedPrice } from '../../utils/price';

interface Props {
    data: {
        stripeProduct: StripeProductNode;
        allStripePrice: { nodes: StripePriceNode[] };
    };
}

const photoImgStyles: React.CSSProperties = {
    maxWidth: 1200,
};

export default function PhotoPage({
    data: { stripeProduct, allStripePrice },
}: Props) {
    const prices = allStripePrice.nodes.sort(byUnitAmount);
    const [shoppingCart] = useCart();
    const [price, setPrice] = useState<string>(prices[0].id);

    function byUnitAmount(a: Stripe.Price, b: Stripe.Price): number {
        return (a.unit_amount ?? 0) - (b.unit_amount ?? 0);
    }

    function handleNewPrice(event: React.ChangeEvent<{ value: unknown }>) {
        setPrice(event.target.value as string);
    }

    function addToCart() {
        const stripePrice = prices.find(
            (stripePriceNode) => stripePriceNode.id === price
        );
        if (stripePrice) {
            shoppingCart.add(stripePrice);
        }
    }

    return (
        <div>
            <h2>{stripeProduct.name}</h2>
            <h4>{stripeProduct.description}</h4>
            <Img
                style={photoImgStyles}
                fluid={stripeProduct.localFiles[0].childImageSharp.fluid!}
            />
            <div>
                <Select value={price} onChange={handleNewPrice}>
                    {prices.map((price) => (
                        <MenuItem key={price.id} value={price.id}>
                            {price.nickname}: {formattedPrice(price)}
                        </MenuItem>
                    ))}
                </Select>
                <Button onClick={addToCart}>Add to cart</Button>
            </div>
        </div>
    );
}

export const query = graphql`
    query($id: String) {
        stripeProduct(id: { eq: $id }) {
            name
            description
            localFiles {
                childImageSharp {
                    fluid(maxWidth: 1200) {
                        ...GatsbyImageSharpFluid_withWebp_tracedSVG
                    }
                }
            }
        }
        allStripePrice(filter: { product: { id: { eq: $id } } }) {
            nodes {
                id
                nickname
                unit_amount
            }
        }
    }
`;
