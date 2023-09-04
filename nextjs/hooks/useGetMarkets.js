import { predictionWorldAddress } from "@/config";
import { BACKUP_IMAGE } from "@/constants/Constant";
import { MARKET_ORDER, MARKET_STATUS, MARKET_WITH_TEST } from "@/constants/MarketCondition";
import { useAccountStore } from "@/store/useAccountStore";
import { useContractStore } from "@/store/useContractStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { useMarketsStore } from "@/store/useMarketsStore";
import { testMarketsData } from "@/testData/testMarketsData";
import { IsLocal } from "@/utils/IsLocal";
import PredictionWorld from "@/utils/abis/PredictionWorld.json";
import { ethers } from "ethers";
import { useEffect } from "react";

// 未登入玩家替代合約提供者
const PROVIDER = new ethers.providers.JsonRpcProvider("https://polygon-mainnet.g.alchemy.com/v2/B8ncZIIjNn8eul-QPcOcgBac3pFdOH6_");
const PREDICTION_WORLD_CONTRACT = new ethers.Contract(predictionWorldAddress, PredictionWorld.abi, PROVIDER);

const useGetMarkets = () => {
    const { markets, setMarkets, setMarketCount } = useMarketsStore();
    const { account } = useAccountStore();
    const { predictionWorldContract, setPredictionWorldContract } = useContractStore();
    const { setIsMarketLoading } = useLoadingStore();

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
            setIsMarketLoading(true);
            let marketCount = await predictionWorldContract.totalMarkets();
            let tempMarkets = [];
            setMarketCount(marketCount.toNumber());

            const marketContract = await predictionWorldContract.fetchMarkets(
                0,
                marketCount.toNumber(),
                MARKET_STATUS.ALL,
                MARKET_WITH_TEST.YES,
                MARKET_ORDER.ASC
            );

            const markets = marketContract[0];
            for (let i = 0; i < markets.length; i++) {
                let market = markets[i];
                let currentMarket = {
                    id: market.id.toNumber(),
                    question: market.info.question,
                    imageHash: market.info.creatorImageHash ? market.info.creatorImageHash : BACKUP_IMAGE,
                    totalAmount: market.totalAmount,
                    totalYesAmount: market.totalYesAmount,
                    totalNoAmount: market.totalNoAmount,
                    marketClosed: market.marketClosed,
                    outcome: market.outcome,
                    isTest: market.info.isTest,
                    isSuspended: market.isSuspended,
                    endTimestamp: market.info.endTimestamp
                };

                if (currentMarket.marketClosed) {
                    const bets = await getBets(currentMarket.id);
                    currentMarket = { ...currentMarket, ...bets };
                }

                tempMarkets.push(currentMarket);
            }
            setMarkets(tempMarkets);
        } catch (error) {
            console.error(`Error getting market: ${error}`);
        } finally {
            setIsMarketLoading(false);
        }
    };

    useEffect(() => {
        updateMarkets();
    }, [account, predictionWorldContract]);

    //如未登入，使用預設合約
    useEffect(() => {
        if (!account) {
            setPredictionWorldContract(PREDICTION_WORLD_CONTRACT);
        }
    }, []);

    return { markets, updateMarkets };
};

export default useGetMarkets;
