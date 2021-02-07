import { Tab } from '@material-ui/core';
import { Link } from 'gatsby-theme-material-ui';
import { NavBarTab } from './NavBar';
import React from 'react';

interface NavigationTabProps {
    tab: NavBarTab;
}

export default function NavigationTab({ tab }: NavigationTabProps) {
    function tabProps(index: string) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    return (
        <Link to={tab.to}>
            <Tab label={tab.label} {...tabProps(tab.to.slice(1))}></Tab>
        </Link>
    );
}
