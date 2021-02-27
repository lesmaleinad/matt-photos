import { graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import React, { useEffect } from 'react';
import { isBrowser } from '../../contexts/localStorage/storage.service';
import { StripeProductNode } from '../../types/stripe';
import { photoPageLink } from '../../utils/links';

interface Props {
    data: {
        allStripeProduct: { nodes: StripeProductNode[] };
    };
}

export default function Gallery({ data: { allStripeProduct } }: Props) {
    const location = isBrowser ? window.location : null;
    const photos = allStripeProduct.nodes;
    const hash = location?.hash.slice(1);
    const index = hash
        ? photos.findIndex((photo) => photo.name === decodeURI(hash))
        : -1;

    useEffect(() => {
        if (location && index === -1) {
            location.hash = photos[0].name;
        }
    });

    function previousPhoto() {
        if (location) {
            location.hash = photos[index - 1].name;
        }
    }

    function nextPhoto() {
        if (location) {
            location.hash = photos[index + 1].name;
        }
    }

    return (
        <div>
            <h1>Gallery</h1>
            <button disabled={index === 0} onClick={previousPhoto}>
                Prev
            </button>
            <button disabled={index === photos.length - 1} onClick={nextPhoto}>
                Next
            </button>
            {index !== -1 && (
                <Link to={`../${photoPageLink(photos[index])}`}>
                    <Img
                        key={photos[index].id}
                        fixed={
                            photos[index].localFiles[0].childImageSharp.fixed!
                        }
                    />
                </Link>
            )}
        </div>
    );
}

export const query = graphql`
    query {
        allStripeProduct {
            nodes {
                name
                id
                localFiles {
                    childImageSharp {
                        fixed(width: 1200) {
                            ...GatsbyImageSharpFixed_withWebp_tracedSVG
                        }
                    }
                }
            }
        }
    }
`;
