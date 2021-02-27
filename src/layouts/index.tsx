import { Backdrop } from '@material-ui/core';
import React from 'react';
import NavBar, { NavBarTab } from '../components/NavBar/NavBar';
import { useDimmer } from '../contexts/dimmer/dimmerContext';

interface Props {
    location: Location;
    children: JSX.Element;
}

const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
};

const nameStyle: React.CSSProperties = {};

export default function Layout({ location, children }: Props) {
    const [dimmer, isDim] = useDimmer();
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

    function dimmerOff() {
        dimmer.off();
    }

    return (
        <div className="layout">
            <div style={headerStyle}>
                <span style={nameStyle}>Matt Dahle</span>
                <NavBar location={location.pathname} tabs={tabs} />
            </div>
            <Backdrop
                style={{
                    zIndex: 1,
                    color: '#fff',
                }}
                open={isDim}
                onClick={dimmerOff}
            ></Backdrop>
            {children}
        </div>
    );
}
