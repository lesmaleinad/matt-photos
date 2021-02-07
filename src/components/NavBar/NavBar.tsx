import { Tabs } from '@material-ui/core';
import React from 'react';
import NavigationTab from './NavigationTab';

export interface NavBarTab {
    to: string;
    label: string;
}

interface Props {
    tabs: NavBarTab[];
}

export default function NavBar({ tabs }: Props) {
    function findTabIndex(location: string): number {
        return tabs.findIndex((tab) => tab.to === location);
    }

    return (
        <Tabs
            value={findTabIndex(window.location.pathname)}
            TabIndicatorProps={{ style: { background: 'black' } }}
        >
            {tabs.map((tab) => (
                <NavigationTab tab={tab} />
            ))}
        </Tabs>
    );
}
