import "tailwindcss/tailwind.css";
import "../styles/globals.css";

import { MENU_TYPE } from "@/constants/Constant";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { MarketContext } from "@/contexts/MarketContext";
import { PageContext } from "@/contexts/PageContext";
import { TestContext } from "@/contexts/TestContext";
import { UserInfoContext } from "@/contexts/UserInfoContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AccountContext } from "../contexts/AccountContext";

export default function App({ Component, pageProps }) {
    const router = useRouter();
    const { menu, marketid } = router.query;
    const [account, setAccount] = useState();
    const defaultMenu = menu ? menu : MENU_TYPE.MARKET;
    const defaultMarketID = marketid ? marketid : null;

    // testing
    const [account2, setAccount2] = useState("no one yet");
    const [socialLoginSDK, setSocialLoginSDK] = useState(null);
    const [provider, setProvider] = useState(null);
    const [smartAccount, setSmartAccount] = useState(null);
    const [sureTokenContract, setSureTokenContract] = useState(null);
    const [sureTokenInterface, setSureTokenInterface] = useState(null);
    const [predictionWorldContract, setPredictionWorldContract] = useState(null);
    const [predictionWorldInterface, setPredictionWorldInterface] = useState(null);
    const [email, setEmail] = useState("");

    //Loading Context
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [isMarketLoading, setIsMarketLoading] = useState(false);
    const [isSendAccountReady, setisSendAccountReady] = useState(false);

    //Page Context
    const [currentMenu, setCurrentMenu] = useState(defaultMenu);
    const [currentMarketID, setCurrentMarketID] = useState(defaultMarketID);

    //Markets Context
    const [markets, setMarkets] = useState();
    const [yesInfo, setYesInfo] = useState([]);
    const [noInfo, setNoInfo] = useState([]);
    const [marketDetail, setMarketDetail] = useState({
        id: null,
        title: "title of market",
        imageHash: "",
        endTimestamp: "1681681545",
        totalAmount: 0,
        totalYesAmount: 0,
        totalNoAmount: 0,
        description: "",
        resolverUrl: null,
        isClose: undefined
    });

    //UserInfo Context
    const [balance, setBalance] = useState(0);
    const [userTotalBetValue, setUserTotalBetValue] = useState(0);
    const [userStatements, setUserStatements] = useState(null);
    const [hasGetFirstData, setHasGetFirstData] = useState(false);

    const contextValue = {
        account2,
        setAccount2,
        socialLoginSDK,
        setSocialLoginSDK
    };

    useEffect(() => {
        setCurrentMenu(defaultMenu);
        setCurrentMarketID(marketid);
    }, [menu, marketid]);

    return (
        <AccountContext.Provider value={[account, setAccount]}>
            <BiconomyAccountContext.Provider
                value={{
                    account,
                    setAccount,
                    socialLoginSDK,
                    setSocialLoginSDK,
                    provider,
                    setProvider,
                    smartAccount,
                    setSmartAccount,
                    sureTokenContract,
                    setSureTokenContract,
                    sureTokenInterface,
                    setSureTokenInterface,
                    predictionWorldContract,
                    setPredictionWorldContract,
                    predictionWorldInterface,
                    setPredictionWorldInterface,
                    email,
                    setEmail,
                    isSendAccountReady,
                    setisSendAccountReady
                }}
            >
                <LoadingContext.Provider value={{ isPageLoading, setIsPageLoading, isMarketLoading, setIsMarketLoading }}>
                    <PageContext.Provider value={{ currentMenu, setCurrentMenu, currentMarketID, setCurrentMarketID }}>
                        <MarketContext.Provider value={{ markets, setMarkets, yesInfo, setYesInfo, noInfo, setNoInfo, marketDetail, setMarketDetail }}>
                            <UserInfoContext.Provider
                                value={{
                                    balance,
                                    setBalance,
                                    userTotalBetValue,
                                    setUserTotalBetValue,
                                    userStatements,
                                    setUserStatements,
                                    hasGetFirstData,
                                    setHasGetFirstData
                                }}
                            >
                                <TestContext.Provider value={contextValue}>
                                    <Component {...pageProps} />
                                </TestContext.Provider>
                            </UserInfoContext.Provider>
                        </MarketContext.Provider>
                    </PageContext.Provider>
                </LoadingContext.Provider>
            </BiconomyAccountContext.Provider>
        </AccountContext.Provider>
    );
}
