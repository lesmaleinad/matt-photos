import { Backdrop, Container } from '@material-ui/core';
import { useStaticQuery, graphql } from 'gatsby';
import React from 'react';
import CheckoutDialog from '../components/Checkout/CheckoutDialog';
import CheckoutEntry from '../components/Checkout/CheckoutEntry';
import NavBar, { NavBarTab } from '../components/NavBar/NavBar';
import { useDimmer } from '../contexts/dimmer/dimmerContext';
import { StripePriceNode } from '../types/stripe';

interface QueryData {
    allStripePrice: {
        nodes: StripePriceNode[];
    };
}

const getStripePrices = () => {
    const { allStripePrice }: QueryData = useStaticQuery(graphql`
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
        }
    `);
    return allStripePrice.nodes;
};

interface Props {
    location: Location;
    children: JSX.Element;
}

const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 2,
    backgroundColor: '#fafafa',
};

const nameStyle: React.CSSProperties = {};

export default function Layout({ location, children }: Props) {
    const [_, isDim] = useDimmer();
    const stripePrices = getStripePrices();
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
            <div style={headerStyle}>
                <span style={nameStyle}>Matt Dahle</span>
                <NavBar location={location.pathname} tabs={tabs} />
            </div>
            <CheckoutDialog stripePrices={stripePrices} />
            <CheckoutEntry />
            <Backdrop
                style={{
                    zIndex: -1,
                    color: '#fff',
                }}
                open={isDim}
                transitionDuration={500}
            ></Backdrop>
            <Container>{children}</Container>
        </div>
    );
}
