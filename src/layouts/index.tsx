import { Backdrop, Container, useMediaQuery } from '@material-ui/core';
import { useStaticQuery, graphql } from 'gatsby';
import Img, { FluidObject } from 'gatsby-image';
import React, { useEffect, useRef, useState } from 'react';
import CheckoutDialog from '../components/Checkout/CheckoutDialog';
import CheckoutEntry from '../components/Checkout/CheckoutEntry';
import NavBar, { NavBarTab } from '../components/NavBar/NavBar';
import { useDimmer } from '../contexts/dimmer/dimmerContext';
import { StripePriceNode } from '../types/stripe';
import { useSizes } from '../utils/mediaQueries';

interface QueryData {
    allStripePrice: {
        nodes: StripePriceNode[];
    };
    file: {
        childImageSharp: {
            fluid: FluidObject;
        };
    };
}

const getData = () => {
    const { allStripePrice, file }: QueryData = useStaticQuery(graphql`
        query {
            allStripePrice {
                nodes {
                    id
                    product {
                        name
                        localFiles {
                            childImageSharp {
                                fluid(maxWidth: 150, maxHeight: 100) {
                                    ...GatsbyImageSharpFluid_withWebp_tracedSVG
                                }
                            }
                        }
                    }
                }
            }
            file(relativePath: { eq: "signature.png" }) {
                childImageSharp {
                    fluid {
                        ...GatsbyImageSharpFluid_withWebp
                    }
                }
            }
        }
    `);
    return { stripePrices: allStripePrice.nodes, logo: file.childImageSharp };
};

interface Props {
    location: Location;
    children: JSX.Element;
}

const headerStyle: React.CSSProperties = {
    position: 'fixed',
    minHeight: '100vh',
    zIndex: 2,
    backgroundColor: '#fafafa',
};

const mainStyles: React.CSSProperties = {
    display: 'flex',
};

export default function Layout({ location, children }: Props) {
    const { isSmall } = useSizes();
    const header = useRef<HTMLDivElement | null>(null);
    const [headerWidth, setHeaderWidth] = useState<number>(0);
    const [_, isDim] = useDimmer();
    const { stripePrices, logo } = getData();
    useEffect(() => {
        setHeaderWidth(header.current?.offsetWidth || 0);
    }, [header.current?.offsetWidth, isSmall]);
    const tabs: NavBarTab[] = [
        {
            to: '/',
            label: 'Home',
        },
        {
            to: '/gallery/',
            label: 'Gallery',
        },
        {
            to: '/about/',
            label: 'About',
        },
        {
            to: '/contact/',
            label: 'Contact',
        },
    ];

    return (
        <div className="layout">
            <div className="main" style={mainStyles}>
                <div ref={header} style={headerStyle}>
                    <div style={{ padding: 8 }} className="logo">
                        <Img fluid={logo.fluid} />
                    </div>

                    <NavBar location={location.pathname} tabs={tabs} />
                </div>

                <div
                    className="content"
                    style={{
                        paddingLeft: headerWidth,
                        width: '100%',
                    }}
                >
                    <Container>
                        <Backdrop
                            style={{
                                zIndex: -1,
                                color: '#fff',
                            }}
                            open={isDim}
                            transitionDuration={500}
                        ></Backdrop>
                        {children}
                    </Container>
                </div>
            </div>

            <CheckoutDialog stripePrices={stripePrices} />
            <CheckoutEntry />
        </div>
    );
}
