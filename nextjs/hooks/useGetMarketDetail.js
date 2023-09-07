import { BACKUP_IMAGE } from "@/constants/Constant";
import syncMarketDetail from "@/service/market/getMarketDetail";
import { useAccountStore } from "@/store/useAccountStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { useMarketDetailStore } from "@/store/useMarketDetailStore";
import { useMarketsStore } from "@/store/useMarketsStore";
import { useMenuStore } from "@/store/useMenuStore";
import moment from "moment";
import { useCallback, useEffect } from "react";

export const useGetMarketDetail = () => {
    const { account } = useAccountStore();

    const { marketDetail, setMarketDetail } = useMarketDetailStore();
    const { currentMarketID } = useMenuStore();
    const { setIsPageLoading } = useLoadingStore();
    const { markets } = useMarketsStore();

    const marketStatus = {
        RUNNING: "00",
        CLOSED: "10",
        SUSPEND: "20",
        REFUND: "30"
    };

    const updateMarketDetail = useCallback(
        async (currentMarketID) => {
            try {
                setIsPageLoading(true);
                const response = await syncMarketDetail({
                    marketId: currentMarketID
                });
                if (!!response && response.ErrorCode === 0) {
                    const responseEndTime = response.Result.MarketDetail.EndTime;
                    const endTimeFormat = moment(responseEndTime).format("MMMM D, YYYY HH:mm");
                    const dateFormat = moment.unix(responseEndTime / 1000);

                    const detail = response.Result.MarketDetail;
                    const target = markets.find((item) => {
                        if (item.id == currentMarketID) {
                            return item;
                        }
                    });
                    const getTotal = target.totalAmount;
                    const getYesTotal = target.totalYesAmount;
                    const getNoTotal = target.totalNoAmount;

                    setMarketDetail({
                        id: detail.MarketId,
                        title: detail.Title,
                        imageHash: detail.ImageHash ? detail.ImageHash : BACKUP_IMAGE,
                        endTimestamp: endTimeFormat,
                        endDate: dateFormat,
                        totalAmount: getTotal,
                        totalYesAmount: getYesTotal,
                        totalNoAmount: getNoTotal,
                        description: detail.Description,
                        resolverUrl: detail.ResolveUrl,
                        isClose: detail.Status === marketStatus.CLOSED,
                        isTest: detail.IsTest,
                        isSuspended: detail.Status === marketStatus.SUSPEND
                    });
                }
                setIsPageLoading(false);
            } catch (error) {
                console.error(`Error getting market detail ${error}`);
            }
        },
        [currentMarketID]
    );

    useEffect(() => {
        if (currentMarketID) {
            updateMarketDetail(currentMarketID);
        }
    }, [currentMarketID, account, updateMarketDetail]);

    return { marketDetail, updateMarketDetail };
};
