import { BACKUP_IMAGE } from "@/constants/Constant";
import { API_MARKET_STATUS } from "@/constants/MarketCondition";
import syncMarketDetail from "@/service/market/getMarketDetail";
import syncMarketTickets from "@/service/market/getMarketTickets";
import { useAccountStore } from "@/store/useAccountStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { useMarketDetailStore } from "@/store/useMarketDetailStore";
import { useMenuStore } from "@/store/useMenuStore";
import moment from "moment";
import { useCallback, useEffect } from "react";

export const useGetMarketDetail = () => {
    const { account } = useAccountStore();

    const { marketDetail, setMarketDetail } = useMarketDetailStore();
    const { currentMarketID } = useMenuStore();
    const { setIsPageLoading } = useLoadingStore();

    const getBets = async (currentMarketID) => {
        try {
            const response = await syncMarketTickets({
                marketId: Number(currentMarketID)
            });
            let yesAmount = 0;
            let noAmount = 0;
            if (!!response && response.ErrorCode === 0) {
                response.Result.Tickets.forEach((ticket) => {
                    if (ticket.BetTypeName === "Yes") {
                        yesAmount += ticket.Stake;
                    } else if (ticket.BetTypeName === "No") {
                        noAmount += ticket.Stake;
                    }
                });
            }
            return { yesAmount, noAmount };
        } catch (error) {
            console.error(`Error getting bets, ${error}`);
        }
    };
    const updateMarketDetail = useCallback(
        async (currentMarketID) => {
            try {
                setIsPageLoading(true);
                const response = await syncMarketDetail({
                    marketId: currentMarketID
                });
                if (!!response && response.ErrorCode === 0) {
                    const detail = response.Result.MarketDetail;
                    const responseEndTime = detail.EndTime;
                    const endTimeFormat = moment(responseEndTime).format("MMMM D, YYYY HH:mm");
                    const dateFormat = moment.unix(responseEndTime / 1000);
                    const betAmount = await getBets(currentMarketID);
                    const getYesTotal = betAmount.yesAmount;
                    const getNoTotal = betAmount.noAmount;
                    const getTotal = Number(getYesTotal) + Number(getNoTotal);

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
                        isClose: detail.Status === API_MARKET_STATUS.CLOSED,
                        isTest: detail.IsTest,
                        isSuspended: detail.Status === API_MARKET_STATUS.SUSPENDED
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
