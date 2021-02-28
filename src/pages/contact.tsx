import { Button } from '@material-ui/core';
import React from 'react';
import { useCheckout } from '../contexts/checkout/checkoutContext';
import { useDimmer } from '../contexts/dimmer/dimmerContext';

export default function Contact() {
    const [dimmer] = useDimmer();
    const [checkout] = useCheckout();

    function toggleDimmer() {
        dimmer.toggle();
    }

    return (
        <div>
            <h1>Contact</h1>
            <Button onClick={toggleDimmer}>Toggle Dimmer</Button>
        </div>
    );
}
