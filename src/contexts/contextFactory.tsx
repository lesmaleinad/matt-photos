import React, { createContext, useContext, useState } from 'react';

type Props = {
    children: React.ReactNode;
};

export abstract class StatefulRootContext<T> {
    public abstract state: T;
    public setState!: React.Dispatch<React.SetStateAction<T>>;
}

export const rootContextProviders: ((props: Props) => JSX.Element)[] = [];

export function provideStatefulContextToRoot<
    T,
    Klass extends StatefulRootContext<T>
>(klass: Klass) {
    const Context = createContext<[Klass, T]>([klass, klass.state]);
    const Provider = ({ children }: Props) => {
        const [contextState, setContextState] = useState<T>(klass.state);
        klass.state = contextState;
        klass.setState = setContextState;

        return (
            <Context.Provider value={[klass, contextState]}>
                {children}
            </Context.Provider>
        );
    };
    rootContextProviders.push(Provider);
    return () => {
        return useContext(Context);
    };
}

export default function provideContextToRoot<T>(value: T) {
    const Context = createContext<T>(value);
    const Provider = ({ children }: Props) => {
        return <Context.Provider value={value}>{children}</Context.Provider>;
    };
    rootContextProviders.push(Provider);
    return () => {
        return useContext(Context);
    };
}
