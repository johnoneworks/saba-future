import { Header } from "@/components/Header/Header";
import MarketLoading from "@/components/LoadingPage/MarketLoading";
import PageLoading from "@/components/LoadingPage/PageLoading";
import MarketCard from "@/components/MarketCard/MarketCard";
import { Statement } from "@/components/Statement/Statement";
import { MARKET_STATUS, MENU_TYPE } from "@/constants/Constant";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { PageContext } from "../contexts/PageContext";
import useGetMarkets from "../hooks/useGetMarkets";
import styles from "../styles/Home.module.css";
/**
 * TODO:
 * 1. add market loading √
 * 2. 更新market √
 * 3. 切換Tab邏輯 √
 * 4. useGetBalance hook √
 * 5. 把 markets 抽出去做成一個 component
 * 6. 優化 router
 */

const ShowMarkets = (props) => {
    const { marketStatus, markets, account } = props;
    const isClose = marketStatus !== MARKET_STATUS.OPEN;

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
    const router = useRouter();
    const { menu, marketId } = router.query;
    const { account } = useContext(BiconomyAccountContext);
    const { isMarketLoading } = useContext(LoadingContext);
    const { currentMenu } = useContext(PageContext);
    const { markets, updateMarkets } = useGetMarkets();

    useEffect(() => {
        if (account && !menu) {
            router.push({
                pathname: `/`,
                query: { menu: currentMenu }
            });
        }
    }, [account]);

    return (
        <div className={styles.container}>
            <PageLoading />
            {/* Header NavBar */}
            <Header />
            <main className="w-full flex flex-col sm:flex-row flex-wrap sm:flex-nowrap py-4 flex-grow max-w-5xl">
                {/* TODO: refactor Markets 拆出去 */}
                {account && menu === MENU_TYPE.MARKET && (
                    <>
                        <MarketLoading />
                        {!isMarketLoading && (
                            <div className="w-full flex flex-col flex-grow pt-1">
                                <div className={styles.marketCardContainer}>
                                    <ShowMarkets marketStatus={MARKET_STATUS.OPEN} markets={markets} account={account} />
                                </div>
                                <div>Closed Markets</div>
                                <div className="flex flex-wrap overflow-hidden sm:-mx-1 md:-mx-2">
                                    <ShowMarkets marketStatus={MARKET_STATUS.CLOSE} markets={markets} account={account} />
                                </div>
                            </div>
                        )}
                    </>
                )}
                {/* TODO: STATEMENT */}
                {menu === MENU_TYPE.STATEMENT && <Statement />}
            </main>
        </div>
    );
}
