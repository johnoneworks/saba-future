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
    const handleFetchMarketDetail = async (currentMarketID) => {
        const response = await syncMarketDetail({ marketId: currentMarketID });
        if (!!response && response.ErrorCode == 0) {
            const detail = response.Result.MarketDetail;
            const endTimeFormat = moment(detail.EndTime).format("MMMM D, YYYY");
            const createTimeFormat = moment(detail.CreateTime).format("MMMM D, YYYY");
            const data = {
                id: detail.MarketId,
                title: detail.Title,
                resolverUrl: detail.ResolveUrl,
                imageHash: detail.ImageHash ? detail.ImageHash : BACKUP_IMAGE,
                endTimestamp: endTimeFormat,
                totalYesAmount: detail.BetInfo.Yes,
                totalNoAmount: detail.BetInfo.No,
                createDate: createTimeFormat,
                outcome: detail.Outcome
            };
            if (!getMarket.some((item) => item.id === data.id)) {
                getMarket.push(data);
            }
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
                        await handleFetchMarketDetail(id);
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
                        totalYesAmount: market.totalYesAmount,
                        totalNoAmount: market.totalNoAmount,
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
