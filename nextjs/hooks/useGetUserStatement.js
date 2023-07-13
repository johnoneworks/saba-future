import { BACKUP_IMAGE } from "@/constants/Constant";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { UserInfoContext } from "@/contexts/UserInfoContext";
import { testMarketsData } from "@/testData/testMarketsData";
import { testUserBetList } from "@/testData/testStatementsData";
import { IsLocal } from "@/utils/IsLocal";
import { useCallback, useContext, useEffect } from "react";

/**
 * TODO
 * 1. 確認資料正確 √
 * 2. 優化速度
 * 3. setHasGetFirstData 優化
 */

const useGetUserStatement = () => {
    const { smartAccount, predictionWorldContract } = useContext(BiconomyAccountContext);
    const { setUserTotalBetValue, setUserStatements, setHasGetFirstData } = useContext(UserInfoContext);
    const { setIsMarketLoading } = useContext(LoadingContext);

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
                    hasResolved: market?.marketClosed,
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

    const updateStatements = useCallback(async () => {
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
                    imageHash: market.info.creatorImageHash ? market.info.creatorImageHash : BACKUP_IMAGE,
                    totalAmount: market.totalAmount,
                    totalYesAmount: market.totalYesAmount,
                    totalNoAmount: market.totalNoAmount,
                    hasResolved: market.marketClosed,
                    endTimestamp: market.info.endTimestamp,
                    timestamp: market.info.timestamp,
                    outcome: market.outcome,
                    isTest: market.info.isTest,
                });
            }
            console.log(`markets size: ${markets.length}`);

            let userBetList = [];
            let totalBetAmount = 0;
            for (let i = 0; i < markets.length; i++) {
                const marketBets = await predictionWorldContract.getUserBets(smartAccount.address, i);
                const yesBets = marketBets.yesBets;
                yesBets.forEach((bet) => {
                    userBetList.push({
                        id: i.toString(),
                        yesAmount: bet.amount.toString(),
                        timestamp: bet.timestamp.toString()
                    });
                    totalBetAmount += parseInt(bet.amount);
                });
                const noBets = marketBets.noBets;
                noBets.forEach((bet) => {
                    userBetList.push({
                        id: i.toString(),
                        noAmount: bet.amount.toString(),
                        timestamp: bet.timestamp.toString()
                    });
                    totalBetAmount += parseInt(bet.amount);
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
            setHasGetFirstData(true);
            setIsMarketLoading(false);
        } catch (error) {
            console.error(`Error getting markets, ${error}`);
        }
    }, [predictionWorldContract]);

    useEffect(() => {
        if (smartAccount && predictionWorldContract) {
            updateStatements();
        }
    }, [smartAccount, updateStatements]);

    return { updateStatements };
};

export default useGetUserStatement;
