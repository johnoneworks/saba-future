import { BACKUP_IMAGE } from "@/constants/Constant";
import { API_MARKET_STATUS } from "@/constants/MarketCondition";
import syncAllMarkets from "@/service/market/getAllMarkets";
import { useAccountStore } from "@/store/useAccountStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { useMarketsStore } from "@/store/useMarketsStore";
import { useEffect } from "react";

const useGetMarkets = () => {
    const { markets, setMarkets, setMarketCount } = useMarketsStore();
    const { account } = useAccountStore();
    const { setIsMarketLoading } = useLoadingStore();

    const updateMarkets = async () => {
        try {
            const response = await syncAllMarkets();
            if (!!response && response.ErrorCode === 0) {
                let tempMarkets = [];
                if (!!response.Result.Markets) {
                    response.Result.Markets.reduce((markets, market) => {
                        markets.push({
                            id: market.MarketId,
                            question: market.Title,
                            imageHash: market.ImageUrl ? market.ImageUrl : BACKUP_IMAGE,
                            totalAmount: Number(market.BetInfo.Yes + market.BetInfo.No),
                            totalYesAmount: market.BetInfo.Yes,
                            totalNoAmount: market.BetInfo.No,
                            marketClosed: market.Status === API_MARKET_STATUS.CLOSED,
                            outcome: market.Outcome,
                            isTest: market.IsTest,
                            isSuspended: market.Status === API_MARKET_STATUS.SUSPENDED,
                            endTimestamp: market.EndTime,
                            winnerCount: market.WinnerCount,
                            winnerProfit: market.WinnerProfit
                        });
                        return markets;
                    }, tempMarkets);
                }
                setMarkets(tempMarkets);
                setMarketCount(tempMarkets.length);
            }
        } catch (error) {
            // TODO: 這邊炸掉應該是要做一些處理
            console.error(`Error getting market: ${error}`);
        } finally {
            setIsMarketLoading(false);
        }
    };

    useEffect(() => {
        updateMarkets();
    }, [account]);

    return { markets, updateMarkets };
};

export default useGetMarkets;
