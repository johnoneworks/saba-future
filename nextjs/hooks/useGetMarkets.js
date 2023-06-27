import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { testMarketsData } from "@/testData/testMarketsData";
import { IsLocal } from "@/utils/IsLocal";
import { useContext, useEffect, useState } from "react";

/**
 * TODO:
 * 1. 把getBets()的功能拆分出来，放到useGetBets.js中
 * 2. update market 的速度太慢，需要優化
 *
 */

const useGetMarkets = () => {
    const [markets, setMarkets] = useState();
    const { account, smartAccount, predictionWorldContract } = useContext(BiconomyAccountContext);
    const { setIsMarketLoading } = useContext(LoadingContext);

    const useTestData = () => {
        let tempMarkets = testMarketsData;
        setIsMarketLoading(true);
        setMarkets(tempMarkets);
        setIsMarketLoading(false);
    };

    const getBets = async (marketId) => {
        let bets = await predictionWorldContract.getBets(Number(marketId));
        let yesBets = [];
        let noBets = [];
        // yes bets
        bets["0"].forEach((bet) => {
            yesBets.push({
                time: new Date(parseInt(bet.timestamp + "000")),
                amount: bet.amount.toNumber(),
                user: bet.user
            });
        });
        // no bets
        bets["1"].forEach((bet) => {
            noBets.push({
                time: new Date(parseInt(bet.timestamp + "000")),
                amount: bet.amount.toNumber(),
                user: bet.user
            });
        });
        return {
            yesBets,
            noBets
        };
    };

    const updateMarkets = async () => {
        //使用假資料，不需要就 false 掉
        if (IsLocal()) {
            useTestData();
            return;
        }

        try {
            if (!smartAccount.address) {
                return;
            }
            setIsMarketLoading(true);
            let marketCount = await predictionWorldContract.totalMarkets();
            let tempMarkets = [];
            for (let i = 0; i < marketCount; i++) {
                let market = await predictionWorldContract.markets(i);
                console.log(i);
                console.log(`market.id: ${market.info.question}`);

                let mt = {
                    id: market.id,
                    question: market.info.question,
                    imageHash: market.info.creatorImageHash,
                    totalAmount: market.totalAmount,
                    totalYesAmount: market.totalYesAmount,
                    totalNoAmount: market.totalNoAmount,
                    marketClosed: market.marketClosed,
                    outcome: market.outcome
                };

                if (market.marketClosed) {
                    const bets = await getBets(market.id);
                    mt = { ...mt, ...bets };
                }

                tempMarkets.push(mt);
            }
            setMarkets(tempMarkets);
            setIsMarketLoading(false);
        } catch (error) {
            console.error(`Error getting market: ${error}`);
        }
    };

    useEffect(() => {
        updateMarkets();
    }, [account]);

    return { markets, updateMarkets };
};

export default useGetMarkets;
