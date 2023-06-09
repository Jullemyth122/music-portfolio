import React, { createContext, useContext, useState } from 'react'
import { LoadingProps } from '@/props/ContextProps'

const GlobalContext = createContext<LoadingProps>(
    {} as LoadingProps
);

const GlobalProvider:React.FC<{ children: any }> = ({children}) => {
    const [loadingState, setLoadingState] = useState<boolean>(false);
    const [loadingCount, setLoadingCount] = useState<number>(0);
    
    const value = {
        loadingState,
        setLoadingState,
        loadingCount,
        setLoadingCount
    }

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    )
}

const useGlobal = () => {
    const data = useContext(GlobalContext);
    return { ...data };
};

export { GlobalProvider, useGlobal };