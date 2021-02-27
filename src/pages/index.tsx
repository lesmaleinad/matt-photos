import { graphql, Link } from 'gatsby';
import React from 'react';
import Img from 'gatsby-image';
import App from '../components/App/App';
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
        <>
            {stripeProducts.map((product) => (
                <Link to={photoPageLink(product)} style={{ width: 400 }}>
                    <Img
                        style={{ width: 400 }}
                        fluid={product.localFiles[0].childImageSharp.fluid!}
                    />
                </Link>
            ))}{' '}
        </>
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
                            ...GatsbyImageSharpFluid_withWebp_tracedSVG
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
