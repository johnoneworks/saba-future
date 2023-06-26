import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { testMarketsData } from "@/testData/testMarketsData";
import { testUserBetList } from "@/testData/testStatementsData";
import { IsLocal } from "@/utils/IsLocal";
import { useCallback, useContext, useEffect, useState } from "react";

/**
 * TODO
 * 1. 確認資料正確
 * 2. 優化速度
 *
 */

const useGetUserStatement = () => {
    const { smartAccount, predictionWorldContract } = useContext(BiconomyAccountContext);
    const { setIsMarketLoading } = useContext(LoadingContext);
    const [userTotalBetValue, setUserTotalBetValue] = useState(0);
    const [userStatements, setUserStatements] = useState([]);

    const useTestData = () => {
        let tempMarkets = testMarketsData;
        let userBetList = testUserBetList;
        let totalBetValue = 0;
        const StatementsInfo = userBetList.reduce((info, statement) => {
            const market = tempMarkets.find((market) => market.id == statement.id);
            totalBetValue += parseInt(statement?.yesAmount) + parseInt(statement?.noAmount);
            if (market) {
                info.push({
                    ...statement,
                    title: market?.info.question,
                    imageHash: market?.imageHash,
                    totalAmount: market?.totalAmount,
                    totalYesAmount: market?.totalYesAmount,
                    totalNoAmount: market?.totalNoAmount,
                    hasResolved: market?.hasResolved,
                    endTimestamp: market?.info.endTimestamp,
                    timestamp: market?.info.timestamp,
                    outcome: market?.outcome
                });
            }
            return info;
        }, []);
        setUserTotalBetValue(totalBetValue);
        setUserStatements(StatementsInfo);
    };

    const getStatement = useCallback(async () => {
        //使用假資料，不需要就 false 掉
        if (IsLocal()) {
            useTestData();
            return;
        }

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

            let userBetList = [];
            let totalBetAmount = 0;
            for (let i = 0; i < markets.length; i++) {
                let marketBets = await predictionWorldContract.getBets(i);
                //Yes Bet
                marketBets["0"].forEach((bet) => {
                    if (bet.user.toLowerCase() == smartAccount.address.toLowerCase()) {
                        userBetList.push({
                            id: i.toString(),
                            yesAmount: bet.amount.toString(),
                            timestamp: bet.timestamp.toString()
                        });
                        totalBetAmount += parseInt(bet.amount);
                    }
                });
                //No Bet
                marketBets["1"].forEach((bet) => {
                    if (bet.user.toLowerCase() == smartAccount.address.toLowerCase()) {
                        userBetList.push({
                            id: i.toString(),
                            noAmount: bet.amount.toString(),
                            timestamp: bet.timestamp.toString()
                        });
                        totalBetAmount += parseInt(bet.amount);
                    }
                });
            }

            const StatementsInfo = userBetList.reduce((info, statement) => {
                const market = markets.find((market) => market.id == statement.id);
                if (market) {
                    info.push({
                        ...statement,
                        title: market?.title,
                        imageHash: market?.imageHash,
                        totalAmount: market?.totalAmount,
                        totalYesAmount: market?.totalYesAmount,
                        totalNoAmount: market?.totalNoAmount,
                        hasResolved: market?.hasResolved,
                        endTimestamp: market?.endTimestamp,
                        timestamp: market?.timestamp,
                        outcome: market?.outcome
                    });
                }
                return info;
            }, []);

            setUserTotalBetValue(totalBetAmount);
            setUserStatements(StatementsInfo);
            setIsMarketLoading(false);
        } catch (error) {
            console.error(`Error getting markets, ${error}`);
        }
    }, [predictionWorldContract]);

    useEffect(() => {
        if (smartAccount && predictionWorldContract) {
            getStatement();
        }
    }, [smartAccount, getStatement]);

    return {
        userTotalBetValue,
        userStatements,
        getStatement
    };
};

export default useGetUserStatement;
