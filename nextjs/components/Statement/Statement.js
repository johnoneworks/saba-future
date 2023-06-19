import { Grid } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";

import PortfolioMarketCard from "@/components/PortfolioMarketCard";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import styles from "../../styles/Home.module.css";
import MarketLoading from "../LoadingPage/MarketLoading";

/**
 * TODO:
 * 1. 切版
 * 2. 優化
 * 3. 用 hook 取資料
 *
 */
export const Statement = () => {
    const { smartAccount, predictionWorldContract } = useContext(BiconomyAccountContext);
    const { setIsMarketLoading } = useContext(LoadingContext);
    const [portfolioValue, setPortfolioValue] = useState(0);
    const [personalBetInfo, setPersonalBetInfo] = useState([]);

    const getMarkets = useCallback(async () => {
        try {
            setIsMarketLoading(true);
            let marketCount = await predictionWorldContract.totalMarkets();

            let markets = [];
            for (let i = 0; i < marketCount; i++) {
                let market = await predictionWorldContract.markets(i);
                markets.push({
                    id: market.id,
                    title: market.info.question,
                    imageHash: "", // temp holder
                    totalAmount: market.totalAmount,
                    totalYesAmount: market.totalYesAmount,
                    totalNoAmount: market.totalNoAmount,
                    hasResolved: market.marketClosed,
                    endTimestamp: market.info.endTimestamp,
                    timestamp: market.info.timestamp,
                    outcome: market.outcome
                });
            }
            console.log(`markets size: ${markets.length}`);

            let personalizedBetInfo = [];
            let totalBetAmount = 0;
            for (let i = 0; i < markets.length; i++) {
                let marketBets = await predictionWorldContract.getBets(i);
                marketBets["0"].forEach((bet) => {
                    if (bet.user.toLowerCase() == smartAccount.address.toLowerCase()) {
                        personalizedBetInfo.push({
                            id: i.toString(),
                            yesAmount: bet.amount.toString(),
                            timestamp: bet.timestamp.toString()
                        });
                        totalBetAmount += parseInt(bet.amount);
                    }
                });
                marketBets["1"].forEach((bet) => {
                    if (bet.user.toLowerCase() == smartAccount.address.toLowerCase()) {
                        personalizedBetInfo.push({
                            id: i.toString(),
                            noAmount: bet.amount.toString(),
                            timestamp: bet.timestamp.toString()
                        });
                        totalBetAmount += parseInt(bet.amount);
                    }
                });
            }
            setPortfolioValue(totalBetAmount);
            for (let i = 0; i < personalizedBetInfo.length; i++) {
                let market = markets.find((market) => market.id == personalizedBetInfo[i].id);
                personalizedBetInfo[i].title = market?.title;
                personalizedBetInfo[i].imageHash = market?.imageHash;
                personalizedBetInfo[i].totalAmount = market?.totalAmount;
                personalizedBetInfo[i].totalYesAmount = market?.totalYesAmount;
                personalizedBetInfo[i].totalNoAmount = market?.totalNoAmount;
                personalizedBetInfo[i].hasResolved = market?.hasResolved;
                personalizedBetInfo[i].endTimestamp = market?.endTimestamp;
                personalizedBetInfo[i].timestamp = market?.timestamp;
                personalizedBetInfo[i].outcome = market?.outcome;
            }
            setPersonalBetInfo(personalizedBetInfo);
            setIsMarketLoading(false);
        } catch (error) {
            console.error(`Error getting markets, ${error}`);
        }
    }, [predictionWorldContract]);

    useEffect(() => {
        if (smartAccount && predictionWorldContract) {
            getMarkets();
        }
    }, [smartAccount, getMarkets]);

    return (
        <div className={styles.container}>
            <div className="w-full flex flex-col pt-1">
                <MarketLoading />
                <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
                    {personalBetInfo.map((market, i) => (
                        <PortfolioMarketCard
                            id={market.id}
                            key={i}
                            title={market.title}
                            betType={!!market.yesAmount ? "Yes" : "No"}
                            amount={!!market.yesAmount ? market.yesAmount : market.noAmount}
                            totalYesAmount={market.totalYesAmount}
                            totalNoAmount={market.totalNoAmount}
                            endTimestamp={market.endTimestamp}
                            timestamp={market.timestamp}
                            hasResolved={market.hasResolved}
                            outcome={market.outcome ? "Yes" : "No"}
                        />
                    ))}
                </Grid>
            </div>
        </div>
    );
};
