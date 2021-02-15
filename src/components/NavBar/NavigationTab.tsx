import { Tab } from '@material-ui/core';
import { Link } from 'gatsby';
import { NavBarTab } from './NavBar';
import React from 'react';

interface NavigationTabProps {
    tab: NavBarTab;
}

const linkStyle: React.CSSProperties = {
    color: 'black',
    textDecoration: 'none',
};

export default function NavigationTab({ tab }: NavigationTabProps) {
    function tabProps(index: string) {
        return {
            id: `simple-tab-${index || 'home'}`,
            'aria-controls': `simple-tabpanel-${index || 'home'}`,
        };
    }

    return (
        <Link style={linkStyle} to={tab.to}>
            <Tab
                label={tab.label}
                {...tabProps(tab.to.replace(/\//g, ''))}
            ></Tab>
        </Link>
    );
}
