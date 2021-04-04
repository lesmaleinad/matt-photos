import { graphql, Link } from 'gatsby';
import React from 'react';
import Img from 'gatsby-image';
import {
    StripePriceNode,
    StripeProduct,
    StripeProductNode,
} from '../types/stripe';
import { photoPageLink } from '../utils/links';

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
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {stripeProducts.map((product) => (
                <Link key={product.id} to={photoPageLink(product)}>
                    <Img
                        style={{
                            maxWidth: '100%',
                            marginTop: 16,
                            marginBottom: 16,
                        }}
                        fluid={product.localFiles[0].childImageSharp.fluid!}
                    />
                </Link>
            ))}
        </div>
    );
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
                        fluid(maxWidth: 1200) {
                            ...GatsbyImageSharpFluid_withWebp
                        }
                    }
                }
            }
        }
    }
`;
