import { Header } from "@/components/Header/Header";
import PageLoading from "@/components/LoadingPage/PageLoading";
import MarketCard from "@/components/MarketCard";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import useGetMarkets from "../hooks/useGetMarkets";
import styles from "../styles/Home.module.css";
/**
 * TODO:
 * 1. add market loading
 * 2. 更新market
 * 3. 切換Tab邏輯
 * 4. useGetBalance hook
 */

const MARKET_TYPE = {
    OPEN: "Open",
    CLOSE: "Close"
};

const ShowMarkets = (props) => {
    const { markeType, markets, account } = props;
    const isClose = markeType !== MARKET_TYPE.OPEN;

    return (
        <>
            {markets &&
                markets.reduce((accumulator, market) => {
                    const isAvailable = isClose ? market.marketClosed : !market.marketClosed;
                    if (isAvailable) {
                        accumulator.push(
                            <div key={market.id} className={styles.marketCard}>
                                <MarketCard
                                    id={market.id}
                                    key={market.id}
                                    title={market.question}
                                    totalAmount={market.totalAmount}
                                    totalYesAmount={market.totalYesAmount}
                                    totalNoAmount={market.totalNoAmount}
                                    outcome={market.outcome}
                                    yesBets={market.yesBets}
                                    noBets={market.noBets}
                                    currentUser={account}
                                    isClosed={isClose}
                                />
                            </div>
                        );
                    }
                    return accumulator;
                }, [])}
        </>
    );
};

export default function Home() {
    const [balance, setBalance] = useState(0);
    const { account, smartAccount, sureTokenContract } = useContext(BiconomyAccountContext);
    const { markets, updateMarkets } = useGetMarkets();

    const getBalance = async () => {
        try {
            if (!smartAccount.address) {
                return;
            }
            let balance = await sureTokenContract.balanceOf(smartAccount.address);
            setBalance(ethers.utils.commify(balance));
        } catch (error) {
            console.error(`Error getting balance, ${error}`);
        }
    };

    const refreshMarkets = () => {
        // updateMarkets() TODO
    };

    useEffect(() => {
        getBalance();
    }, [account]);

    return (
        <div className={styles.container}>
            <PageLoading />
            {/* Header NavBar */}
            <Header />
            <main className="w-full flex flex-col sm:flex-row flex-wrap sm:flex-nowrap py-4 flex-grow max-w-5xl">
                <div className="w-full flex flex-col flex-grow pt-1">
                    You have: {balance} SURE tokens
                    <br />
                    <span className="font-bold my-3 text-lg">Market</span>
                    <div>Open Markets</div>
                    <div className={styles.marketCardContainer}>
                        <ShowMarkets markeType={MARKET_TYPE.OPEN} markets={markets} account={account} />
                    </div>
                    <div>Closed Markets</div>
                    <div className="flex flex-wrap overflow-hidden sm:-mx-1 md:-mx-2">
                        <ShowMarkets markeType={MARKET_TYPE.CLOSE} markets={markets} account={account} />
                    </div>
                </div>
            </main>
        </div>
    );
}
