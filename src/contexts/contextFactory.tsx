import React, { createContext, useContext } from 'react';

type Props = {
    children: React.ReactNode;
};

export const rootContextProviders: ((props: Props) => JSX.Element)[] = [];

export default function provideContextToRoot<T>(value: T) {
    const Context = createContext<T>(value);
    const provider = ({ children }: Props) => {
        return <Context.Provider value={value}>{children}</Context.Provider>;
    };
    rootContextProviders.push(provider);
    return () => {
        return useContext(Context);
    };
}
