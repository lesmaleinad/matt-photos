import { graphql } from 'gatsby';
import React from 'react';
import Img from 'gatsby-image';
import { StripeProductNode } from '../../types/stripe';
import { useCart } from '../../contexts/cart/cartContext';

interface Props {
    data: {
        stripeProduct: StripeProductNode;
    };
}

const photoImgStyles: React.CSSProperties = {
    maxWidth: 1200,
};

export default function PhotoPage({ data: { stripeProduct } }: Props) {
    const [shoppingCart, cartItems] = useCart();

    return (
        <div>
            <h2>{stripeProduct.name}</h2>
            <h4>{stripeProduct.description}</h4>
            <Img
                style={photoImgStyles}
                fluid={stripeProduct.localFiles[0].childImageSharp.fluid!}
            />
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
                    fluid(maxWidth: 1800) {
                        ...GatsbyImageSharpFluid
                    }
                }
            }
        }
    }
`;
