import { BACKUP_IMAGE } from "@/constants/Constant";
import { API_MARKET_STATUS } from "@/constants/MarketCondition";
import syncMarketDetail from "@/service/market/getMarketDetail";
import moment from "moment";

export const getMarketDetail = async (currentMarketId) => {
    try {
        const response = await syncMarketDetail({ marketId: currentMarketId });
        if (!!response && response.ErrorCode === 0) {
            const detail = response.Result.MarketDetail;
            const responseEndTime = detail.EndTime;
            const endTimeFormat = moment(responseEndTime).format("MMMM D, YYYY HH:mm");
            const dateFormat = moment.unix(responseEndTime / 1000);
            const data = {
                id: detail.MarketId,
                title: detail.Title,
                imageHash: detail.ImageHash ? detail.ImageHash : BACKUP_IMAGE,
                endTimestamp: endTimeFormat,
                endDate: dateFormat,
                resolverUrl: detail.ResolveUrl,
                description: detail.Description,
                yesAmount: detail.BetInfo.Yes,
                noAmount: detail.BetInfo.No,
                createDate: detail.CreateTime,
                outcome: detail.Outcome,
                winnerCount: detail.WinnerCount,
                winnerProfit: detail.WinnerProfit,
                isClose: detail.Status === API_MARKET_STATUS.CLOSED,
                isTest: detail.IsTest,
                isSuspended: detail.Status === API_MARKET_STATUS.SUSPENDED
            };
            return data;
        }
    } catch (error) {
        console.error(`Error getting market detail ${error}`);
    }
};
