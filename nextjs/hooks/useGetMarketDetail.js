import { BACKUP_IMAGE } from "@/constants/Constant";
import { LoadingContext } from "@/contexts/LoadingContext";
import { useAccountStore } from "@/store/useAccountStore";
import { useContractStore } from "@/store/useContractStore";
import { useMarketDetailStore } from "@/store/useMarketDetailStore";
import { useMenuStore } from "@/store/useMenuStore";
import moment from "moment";
import { useCallback, useContext, useEffect } from "react";

export const useGetMarketDetail = () => {
    const { account } = useAccountStore();
    const { predictionWorldContract } = useContractStore();

    const { marketDetail, setMarketDetail } = useMarketDetailStore();
    const { currentMarketID } = useMenuStore();
    const { setIsPageLoading } = useContext(LoadingContext);

    const updateMarketDetail = useCallback(
        async (currentMarketID, predictionWorldContract) => {
            try {
                setIsPageLoading(true);
                const market = await predictionWorldContract.markets(currentMarketID);
                const date = moment.unix(market.info.endTimestamp / 1000);
                const dateString = date.format("MMMM D, YYYY HH:mm");
                setMarketDetail({
                    id: currentMarketID,
                    title: market.info.question,
                    imageHash: market.info.creatorImageHash ? market.info.creatorImageHash : BACKUP_IMAGE,
                    endTimestamp: dateString,
                    endDate: date,
                    totalAmount: market.totalAmount,
                    totalYesAmount: market.totalYesAmount,
                    totalNoAmount: market.totalNoAmount,
                    description: market.info.description,
                    resolverUrl: market.info.resolverUrl,
                    isClose: market.marketClosed,
                    isTest: market.info.isTest,
                    isSuspended: market.isSuspended
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

    return { marketDetail, updateMarketDetail };
};
