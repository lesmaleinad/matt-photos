import { Tabs, Tab } from '@material-ui/core';
import { Link } from 'gatsby';
import React, { useState } from 'react';
import NavBar, { NavBarTab } from '../components/NavBar/NavBar';
import NavigationTab from '../components/NavBar/NavigationTab';

interface Props {
    children: JSX.Element;
}

export default function Layout({ children }: Props) {
    const tabs: NavBarTab[] = [
        {
            to: '/',
            label: 'Home',
        },
        {
            to: '/about',
            label: 'About',
        },
        {
            to: '/contact',
            label: 'Contact',
        },
    ];

    return (
        <div className="layout">
            <NavBar tabs={tabs} />
            {children}
        </div>
    );
}
