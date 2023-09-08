import { BACKUP_IMAGE, BET_TYPE } from "@/constants/Constant";
import syncMarketDetail from "@/service/market/getMarketDetail";
import syncCustomerTickets from "@/service/ticket/getCustomerTickets";
import { useLoadingStore } from "@/store/useLoadingStore";
import { usePlayerInfoStore } from "@/store/usePlayerInfoStore";
import { useStatementStore } from "@/store/useStatementStore";
import moment from "moment";
import { useCallback, useEffect } from "react";

const useGetUserStatement = () => {
    const { setHasGetFirstInformation } = usePlayerInfoStore();
    const { setUserStatements } = useStatementStore();
    const { setIsMarketLoading } = useLoadingStore();

    let getMarket = [];
    const getMarketDetail = async (currentMarketID) => {
        try {
            const response = await syncMarketDetail({
                marketId: currentMarketID
            });
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
                    yesAmount: detail.BetInfo.Yes,
                    noAmount: detail.BetInfo.No,
                    createDate: detail.CreateTime,
                    outcome: detail.Outcome
                };
                if (!getMarket.some((item) => item.id === data.id)) {
                    getMarket.push(data);
                }
            }
        } catch (error) {
            console.error(`Error getting market detail ${error}`);
        }
    };
    const updateStatements = useCallback(async () => {
        try {
            setIsMarketLoading(true);
            let response = await syncCustomerTickets();

            const statementInfo = [];
            if (!!response && response.ErrorCode === 0) {
                const uniqueIds = [...new Set(response.Result.Tickets.map((item) => item.MarketId))];
                await Promise.all(
                    uniqueIds.map(async (id) => {
                        await getMarketDetail(id);
                    })
                );
                response.Result.Tickets.map((item) => {
                    const market = getMarket.find((marketItem) => marketItem.id === item.MarketId);
                    const newData = {
                        id: item.MarketId,
                        yesAmount: item.BetTypeName.toUpperCase() === BET_TYPE.YES ? item.Stake : 0,
                        noAmount: item.BetTypeName.toUpperCase() === BET_TYPE.NO ? item.Stake : 0,
                        hasResolved: !!market.resolverUrl,
                        imageHash: market.imageHash,
                        title: market.title,
                        totalYesAmount: market.yesAmount,
                        totalNoAmount: market.noAmount,
                        timestamp: market.createDate,
                        endTimestamp: market.endTimestamp,
                        win: item.Win,
                        outcome: market.outcome
                    };
                    statementInfo.push(newData);
                });
            }
            setUserStatements(statementInfo);
            setHasGetFirstInformation(true);
            setIsMarketLoading(false);
        } catch (error) {
            console.error(`Error getting statement, ${error}`);
        }
    }, []);

    useEffect(() => {
        updateStatements();
    }, [updateStatements]);

    return { updateStatements };
};

export default useGetUserStatement;
