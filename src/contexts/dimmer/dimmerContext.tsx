import {
    provideStatefulContextToRoot,
    StatefulRootContext,
} from '../contextFactory';

class Dimmer extends StatefulRootContext<boolean> {
    public state: boolean = false;

    public toggle() {
        this.setState(!this.state);
    }

    public off() {
        this.setState(false);
    }

    public on() {
        this.setState(true);
    }
}

export const useDimmer = provideStatefulContextToRoot<boolean, Dimmer>(
    new Dimmer()
);
