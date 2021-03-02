import { Fade, Paper, Slide } from '@material-ui/core';
import {
    ArrowBackIosOutlined,
    ArrowForwardIosOutlined,
} from '@material-ui/icons';
import SvgIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
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

const arrowContainerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    height: '100%',
    width: '15%',
    zIndex: 1,
};

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
        if (location && index !== 0) {
            location.hash = photos[index - 1].name;
        }
    }

    function nextPhoto() {
        if (location && index !== photos.length - 1) {
            location.hash = photos[index + 1].name;
        }
    }

    return (
        <div style={{ display: 'flex', position: 'relative' }}>
            {index !== -1 && (
                <Link
                    style={{ flexGrow: 1 }}
                    to={`../${photoPageLink(photos[index])}`}
                >
                    <Img
                        key={photos[index].id}
                        fluid={
                            photos[index].localFiles[0].childImageSharp.fluid!
                        }
                    />
                </Link>
            )}
            <div style={arrowContainerStyles} onClick={previousPhoto}>
                <Fade in={index !== 0} timeout={1000}>
                    <Paper>
                        <LeftArrow />
                    </Paper>
                </Fade>
            </div>
            <div
                style={{
                    ...arrowContainerStyles,
                    right: 0,
                    justifyContent: 'flex-end',
                }}
                onClick={nextPhoto}
            >
                <Fade in={index !== photos.length - 1} timeout={1000}>
                    <Paper>
                        <RightArrow />
                    </Paper>
                </Fade>
            </div>
        </div>
    );
}

const arrowStyles: React.CSSProperties = {
    fontSize: 48,
};

function LeftArrow({ disabled }: { disabled?: boolean }) {
    return (
        <SvgIcon
            style={{
                ...arrowStyles,
                opacity: disabled ? 0.2 : 0.6,
            }}
            component={ArrowBackIosOutlined}
        ></SvgIcon>
    );
}

function RightArrow({ disabled }: { disabled?: boolean }) {
    return (
        <SvgIcon
            style={{
                ...arrowStyles,
                // opacity: index === photos.length - 1 ? 0.2 : 0.6,
                opacity: disabled ? 0.2 : 0.6,
            }}
            component={ArrowForwardIosOutlined}
        ></SvgIcon>
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
                        fluid(maxWidth: 1200) {
                            ...GatsbyImageSharpFluid_withWebp_tracedSVG
                        }
                    }
                }
            }
        }
    }
`;
