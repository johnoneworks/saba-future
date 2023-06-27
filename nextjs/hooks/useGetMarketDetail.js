import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { PageContext } from "@/contexts/PageContext";
import moment from "moment";
import { useCallback, useContext, useEffect, useState } from "react";

const useGetMarketDetail = () => {
    const { account, predictionWorldContract } = useContext(BiconomyAccountContext);
    const { currentMarketID } = useContext(PageContext);

    const [marketDetail, setMarket] = useState({
        id: null,
        title: "title of market",
        endTimestamp: "1681681545",
        totalAmount: 0,
        totalYesAmount: 0,
        totalNoAmount: 0,
        description: "",
        resolverUrl: null,
        isClose: undefined
    });

    const updateMarketDetail = useCallback(
        async (currentMarketID, predictionWorldContract) => {
            try {
                const market = await predictionWorldContract.markets(currentMarketID);
                const date = moment.unix(market.info.endTimestamp / 1000).format("MMMM D, YYYY");
                setMarket({
                    id: currentMarketID,
                    title: market.info.question,
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

    return { marketDetail, updateMarketDetail };
};

export default useGetMarketDetail;
