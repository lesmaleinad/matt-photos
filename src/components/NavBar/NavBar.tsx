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
        return tabs.findIndex((tab) => tab.to === location);
    }

    return (
        <Tabs
            value={getTabIndex()}
            TabIndicatorProps={{ style: { background: 'black' } }}
        >
            {tabs.map((tab) => (
                <NavigationTab tab={tab} />
            ))}
        </Tabs>
    );
}
