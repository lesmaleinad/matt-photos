import React from 'react';
import { useDimmer } from '../contexts/dimmer/dimmerContext';

export default function Contact() {
    const [dimmer] = useDimmer();

    function toggleDimmer() {
        dimmer.toggle();
    }

    return (
        <div>
            <h1>Contact</h1>
            <button onClick={toggleDimmer}>Toggle Dimmer</button>
        </div>
    );
}
