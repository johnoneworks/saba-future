import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { useCallback, useContext, useEffect, useState } from "react";

export const useGetUserStatement = () => {
    const { smartAccount, predictionWorldContract } = useContext(BiconomyAccountContext);
    const { setIsMarketLoading } = useContext(LoadingContext);
    const [userTotalBetValue, setUserTotalBetValue] = useState(0);
    const [userStatements, setUserStatements] = useState([]);

    const getStatement = useCallback(async () => {
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
                const yesBet = marketBets["0"].find((bet) => bet.user.toLowerCase() === smartAccount.address.toLowerCase());
                if (yesBet) {
                    userBetList.push({
                        id: i.toString(),
                        yesAmount: bet.amount.toString(),
                        timestamp: bet.timestamp.toString()
                    });
                    totalBetAmount += parseInt(bet.amount);
                }
                //No Bet
                const noBet = marketBets["1"].find((bet) => bet.user.toLowerCase() === smartAccount.address.toLowerCase());
                if (noBet) {
                    userBetList.push({
                        id: i.toString(),
                        noAmount: bet.amount.toString(),
                        timestamp: bet.timestamp.toString()
                    });
                    totalBetAmount += parseInt(bet.amount);
                }
            }

            const StatementsInfo = userBetList.reduce((info, statement) => {
                const market = markets.find((market) => market.id === statement.id);
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
