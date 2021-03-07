import { Tabs } from '@material-ui/core';
import React from 'react';
import NavigationTab from './NavigationTab';

export interface NavBarTab {
    to: string;
    label: string;
}

interface Props {
    location: string;
    tabs: NavBarTab[];
}

export default function NavBar({ location, tabs }: Props) {
    function getTabIndex(): number {
        if (location.length === 1) {
            return 0;
        } else {
            return (
                tabs.slice(1).findIndex((tab) => location.includes(tab.to)) + 1
            );
        }
    }

    return (
        <Tabs
            orientation="vertical"
            variant="scrollable"
            value={getTabIndex()}
            TabIndicatorProps={{ style: { background: 'black' } }}
        >
            {tabs.map((tab, index) => (
                <NavigationTab key={index} tab={tab} />
            ))}
        </Tabs>
    );
}
