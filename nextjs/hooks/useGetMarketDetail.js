import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { MarketContext } from "@/contexts/MarketContext";
import { PageContext } from "@/contexts/PageContext";
import moment from "moment";
import { useCallback, useContext, useEffect } from "react";

const useGetMarketDetail = () => {
    const { account, predictionWorldContract } = useContext(BiconomyAccountContext);
    const { setMarketDetail } = useContext(MarketContext);
    const { currentMarketID } = useContext(PageContext);

    const updateMarketDetail = useCallback(
        async (currentMarketID, predictionWorldContract) => {
            try {
                const market = await predictionWorldContract.markets(currentMarketID);
                const date = moment.unix(market.info.endTimestamp / 1000).format("MMMM D, YYYY");
                setMarketDetail({
                    id: currentMarketID,
                    title: market.info.question,
                    imageHash: market.info.creatorImageHash ? market.info.creatorImageHash : "/placeholder.jpg",
                    endTimestamp: date,
                    totalAmount: market.totalAmount,
                    totalYesAmount: market.totalYesAmount,
                    totalNoAmount: market.totalNoAmount,
                    description: market.info.description,
                    resolverUrl: market.info.resolverUrl,
                    isClose: market.marketClosed
                });
            } catch (error) {
                console.error(`Error getting market detail, ${error}`);
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
