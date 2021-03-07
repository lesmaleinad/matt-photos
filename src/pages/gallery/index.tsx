import { Button, Fade } from '@material-ui/core';
import {
    ArrowBackIosOutlined,
    ArrowForwardIosOutlined,
} from '@material-ui/icons';
import SvgIcon from '@material-ui/icons/ArrowForwardIos';
import { graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import React, { useEffect, useRef, useState } from 'react';
import { useDimmer } from '../../contexts/dimmer/dimmerContext';
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

const arrowWrapperStyles: React.CSSProperties = {
    border: 0,
    borderRadius: 0,
    boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(0,0,0)',
    height: '100%',
    width: '100%',
};

export default function Gallery({ data: { allStripeProduct } }: Props) {
    const [showArrows, setShowArrows] = useState(true);
    const timeout = useRef<NodeJS.Timeout | undefined>();
    const [dimmer] = useDimmer();

    const location = isBrowser ? window.location : null;
    const photos = allStripeProduct.nodes;
    const hash = location?.hash.slice(1);
    const index = hash
        ? photos.findIndex((photo) => photo.name === decodeURI(hash))
        : -1;

    useEffect(() => {
        dimmer.on();
        return () => dimmer.off();
    }, []);
    useEffect(() => {
        if (location && index === -1) {
            location.hash = photos[0].name;
        } else if (showArrows) {
            timeout.current && clearTimeout(timeout.current);
            timeout.current = setTimeout(() => setShowArrows(false), 2000);
        }
    });
    useEffect(() => {
        function keyDown({ key }: KeyboardEvent) {
            if (key === 'ArrowLeft' || key.toLowerCase() === 'a') {
                previousPhoto();
            } else if (key === 'ArrowRight' || key.toLowerCase() === 'd') {
                nextPhoto();
            }
        }
        window.addEventListener('keydown', keyDown);
        return () => window.removeEventListener('keydown', keyDown);
    });

    function previousPhoto() {
        if (location) {
            location.hash =
                index !== 0
                    ? photos[index - 1].name
                    : photos[photos.length - 1].name;
        }
        setShowArrows(true);
    }

    function nextPhoto() {
        if (location) {
            location.hash =
                index !== photos.length - 1
                    ? photos[index + 1].name
                    : photos[0].name;
        }
        setShowArrows(true);
    }

    return (
        <div className="wrapper" style={{ height: '100vh' }}>
            <div
                onMouseOver={() => setShowArrows(true)}
                style={{
                    display: 'flex',
                    position: 'relative',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: 1200,
                    maxHeight: '80%',
                }}
            >
                {index !== -1 && (
                    <Link
                        style={{ flexGrow: 1 }}
                        to={`../${photoPageLink(photos[index])}`}
                    >
                        <Img
                            key={photos[index].id}
                            fluid={
                                photos[index].localFiles[0].childImageSharp
                                    .fluid!
                            }
                            imgStyle={{ width: 'auto', height: 'auto' }}
                            style={{ height: '100%' }}
                        />
                    </Link>
                )}
                <div style={arrowContainerStyles} onClick={previousPhoto}>
                    <LeftArrow showArrow={showArrows} />
                </div>
                <div
                    style={{
                        ...arrowContainerStyles,
                        right: 0,
                        justifyContent: 'flex-end',
                    }}
                    onClick={nextPhoto}
                >
                    <RightArrow showArrow={showArrows} />
                </div>
            </div>
        </div>
    );
}

interface ArrowProps {
    showArrow: boolean;
}

const arrowTimeout = { appear: 0, enter: 200, exit: 1000 };

const arrowStyles: React.CSSProperties = {
    fontSize: 48,
    opacity: 0.6,
};

function LeftArrow({ showArrow }: ArrowProps) {
    return (
        <Fade in={showArrow} timeout={arrowTimeout}>
            <Button
                style={{
                    ...arrowWrapperStyles,
                    background:
                        'linear-gradient(90deg, rgba(255,255,255,0.7) 0%, rgba(0,0,0,0) 100%)',
                }}
            >
                <SvgIcon
                    style={arrowStyles}
                    component={ArrowBackIosOutlined}
                ></SvgIcon>
            </Button>
        </Fade>
    );
}

function RightArrow({ showArrow }: ArrowProps) {
    return (
        <Fade in={showArrow} timeout={arrowTimeout}>
            <Button
                style={{
                    ...arrowWrapperStyles,
                    background:
                        'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0.7) 100%)',
                }}
            >
                <SvgIcon
                    style={arrowStyles}
                    component={ArrowForwardIosOutlined}
                ></SvgIcon>
            </Button>
        </Fade>
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
