import { BACKUP_IMAGE } from "@/constants/Constant";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { MarketContext } from "@/contexts/MarketContext";
import { PageContext } from "@/contexts/PageContext";
import moment from "moment";
import { useCallback, useContext, useEffect } from "react";

const useGetMarketDetail = () => {
    const { account, predictionWorldContract } = useContext(BiconomyAccountContext);
    const { setMarketDetail } = useContext(MarketContext);
    const { currentMarketID } = useContext(PageContext);
    const { setIsPageLoading } = useContext(LoadingContext);

    const updateMarketDetail = useCallback(
        async (currentMarketID, predictionWorldContract) => {
            try {
                setIsPageLoading(true);
                const market = await predictionWorldContract.markets(currentMarketID);
                const date = moment.unix(market.info.endTimestamp / 1000).format("MMMM D, YYYY");
                setMarketDetail({
                    id: currentMarketID,
                    title: market.info.question,
                    imageHash: market.info.creatorImageHash ? market.info.creatorImageHash : BACKUP_IMAGE,
                    endTimestamp: date,
                    totalAmount: market.totalAmount,
                    totalYesAmount: market.totalYesAmount,
                    totalNoAmount: market.totalNoAmount,
                    description: market.info.description,
                    resolverUrl: market.info.resolverUrl,
                    isClose: market.marketClosed,
                    isTest: market.info.isTest,
                });
                setIsPageLoading(false);
            } catch (error) {
                console.error(`Error getting market detail`);
                console.error(error);
            }
        },
        [currentMarketID, predictionWorldContract]
    );

    useEffect(() => {
        if (currentMarketID && predictionWorldContract) {
            updateMarketDetail(currentMarketID, predictionWorldContract);
        }
    }, [currentMarketID, account, updateMarketDetail]);

    return { updateMarketDetail };
};

export default useGetMarketDetail;
