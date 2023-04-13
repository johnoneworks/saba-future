declare let window: any; //=> weird warning
import { createContext, useContext, useState } from "react";
import Web3 from "web3";
import PredictionWorld2 from "./utils/PredictionWorld2.json";
import SureToken2 from "./utils/SureToken2.json";

interface DataContextProps {
    account: string;
    loading: boolean;
    loadWeb3: () => Promise<void>;
    predictionWorld2: any;
    sureToken2: any;
}

const DataContext = createContext<DataContextProps>({
    account: "",
    loading: true,
    loadWeb3: async () => {},
    predictionWorld2: null,
    sureToken2: null,
});

type DataProviderProps = {
    children?: React.ReactNode
};

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
    const data = useProviderData();

    return <DataContext.Provider value={data}>{children}</DataContext.Provider>
};

export const useData = () => useContext<DataContextProps>(DataContext);

export const useProviderData = () => {
    const [loading, setLoading] = useState(true);
    const [account, setAccount] = useState("");
    const [predictionWorld2, setPredictionWorld2] = useState<any>();
    const [sureToken2, setSureToken2] = useState<any>();

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
    };

    return {
        account,
        predictionWorld2,
        sureToken2,
        loading,
        loadWeb3,
    };
}