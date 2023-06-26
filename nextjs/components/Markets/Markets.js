import MarketLoading from "@/components/LoadingPage/MarketLoading";
import MarketCard from "@/components/MarketCard/MarketCard";
import { MARKET_STATUS, MENU_TYPE } from "@/constants/Constant";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { PageContext } from "@/contexts/PageContext";
import useGetMarkets from "@/hooks/useGetMarkets";
import styles from "@/styles/Home.module.css";
import { useContext } from "react";

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

export const Markets = () => {
    const { account } = useContext(BiconomyAccountContext);
    const { currentMenu, currentMarketID } = useContext(PageContext);
    const { isMarketLoading } = useContext(LoadingContext);
    const { markets } = useGetMarkets();

    return (
        <>
            <MarketLoading />
            {!isMarketLoading && account && currentMenu === MENU_TYPE.MARKET && !currentMarketID && (
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
    );
};
