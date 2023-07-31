import { MENU_TYPE } from "@/constants/Constant";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { MarketContext } from "@/contexts/MarketContext";
import { PageContext } from "@/contexts/PageContext";
import { TestContext } from "@/contexts/TestContext";
import { UserInfoContext } from "@/contexts/UserInfoContext";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import { AccountContext } from "../contexts/AccountContext";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
    const router = useRouter();
    const { menu, marketid } = router.query;
    const [account, setAccount] = useState(null);
    const defaultMenu = menu ? menu : MENU_TYPE.MARKET;
    const defaultMarketID = marketid ? marketid : null;

    //user info
    const [email, setEmail] = useState("");
    const [balance, setBalance] = useState(0);
    const [userTotalBetValue, setUserTotalBetValue] = useState(0);
    const [userStatements, setUserStatements] = useState(null);
    const [hasGetFirstData, setHasGetFirstData] = useState(false);

    //Market Detail
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

    //All Markets
    const [marketCount, setMarketCount] = useState(0);
    const [markets, setMarkets] = useState();
    const [yesInfo, setYesInfo] = useState([]);
    const [noInfo, setNoInfo] = useState([]);

    //web3與合約 相關
    const [socialLoginSDK, setSocialLoginSDK] = useState(null);
    const [provider, setProvider] = useState(null);
    const [smartAccount, setSmartAccount] = useState(null);
    const [sureTokenContract, setSureTokenContract] = useState(null);
    const [sureTokenInterface, setSureTokenInterface] = useState(null);
    const [predictionWorldContract, setPredictionWorldContract] = useState(null);
    const [predictionWorldInterface, setPredictionWorldInterface] = useState(null);
    const [earlyBirdContract, setEarlyBirdContract] = useState(null);
    const [earlyBirdInterface, setEarlyBirdInterface] = useState(null);
    const [earlyBirdValidState, setEarlyBirdValidState] = useState(0);

    //Loading Context
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [isMarketLoading, setIsMarketLoading] = useState(false);
    const [isSendAccountReady, setisSendAccountReady] = useState(false);

    //Page Context
    const [currentMenu, setCurrentMenu] = useState(defaultMenu);
    const [currentMarketID, setCurrentMarketID] = useState(defaultMarketID);

    const contextValue = {
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
                    setisSendAccountReady,
                    earlyBirdContract,
                    setEarlyBirdContract,
                    earlyBirdInterface,
                    setEarlyBirdInterface,
                    earlyBirdValidState,
                    setEarlyBirdValidState
                }}
            >
                <LoadingContext.Provider value={{ isPageLoading, setIsPageLoading, isMarketLoading, setIsMarketLoading }}>
                    <PageContext.Provider value={{ currentMenu, setCurrentMenu, currentMarketID, setCurrentMarketID }}>
                        <MarketContext.Provider
                            value={{ marketCount, setMarketCount, markets, setMarkets, yesInfo, setYesInfo, noInfo, setNoInfo, marketDetail, setMarketDetail }}
                        >
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
                                    <Head>
                                        <title>Saba Orb</title>
                                        <meta name="description" content="Generated by create next app" />
                                        <link rel="icon" href="/logo.ico" />
                                    </Head>
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
