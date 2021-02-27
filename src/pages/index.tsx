import { graphql } from 'gatsby';
import React from 'react';
import App from '../components/App/App';
import {
    StripePriceNode,
    StripeProduct,
    StripeProductNode,
} from '../types/stripe';

interface Props {
    data: {
        allStripePrice: { nodes: StripePriceNode[] };
        allStripeProduct: { nodes: StripeProductNode[] };
    };
}

export default function Index({ data }: Props) {
    const stripeProducts: StripeProduct[] = data.allStripeProduct.nodes.map(
        (stripeProduct) => ({
            ...stripeProduct,
            prices: [],
        })
    );

    data.allStripePrice.nodes.forEach((stripePrice) => {
        const stripeProduct = stripeProducts.find(
            (stripeProduct) => stripeProduct.id === stripePrice.product.id
        );
        stripeProduct?.prices.push(stripePrice);
    });
    return <App pageContext={{ stripeProducts }} />;
}

export const query = graphql`
    query {
        allStripePrice {
            nodes {
                id
                nickname
                unit_amount
                product {
                    id
                }
            }
        }
        allStripeProduct {
            nodes {
                id
                name
                description
                images
                localFiles {
                    childImageSharp {
                        fixed {
                            ...GatsbyImageSharpFixed_withWebp_tracedSVG
                        }
                    }
                }
                metadata {
                    key
                }
            }
        }
    }
`;
