import { EmptyPage } from "@/components/EmptyPage/EmptyPage";
import { Loading } from "@/components/Loading/Loading";
import StatementMarketCard from "@/components/StatementMarketCard";
import { BACKUP_IMAGE, BET_TYPE, MENU_TYPE } from "@/constants/Constant";
import { API_MARKET_STATUS } from "@/constants/MarketCondition";
import syncMarketDetail from "@/service/market/getMarketDetail";
import syncCustomerTickets from "@/service/ticket/getCustomerTickets";
import { useAccountStore } from "@/store/useAccountStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { useMenuStore } from "@/store/useMenuStore";
import { Box, Grid } from "@mui/material";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";

/**
 * TODO:
 * 1. 切版 √
 * 2. 優化
 * 3. 用 hook 取資料 √
 * 4. refresh statement √
 *
 */

export const Statement = (refreshStatement) => {
    const { currentMenu, currentMarketID } = useMenuStore();
    const { isMarketLoading, setIsMarketLoading } = useLoadingStore();
    const { nickName, token } = useAccountStore();
    const [userStatements, setUserStatements] = useState([]);
    const [marketsDetail, setMarketsDetail] = useState([]);

    const handleFetchMarketDetail = useCallback(async (marketId) => {
        try {
            const response = await syncMarketDetail({ marketId: marketId, token: token });
            if (!!response && response.ErrorCode === 0) {
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
                    hasResolved: detail.Status === API_MARKET_STATUS.CLOSED,
                    outcome: detail.Outcome
                };
                return data;
            }
        } catch (error) {
            console.error(`Error getting market detail, ${error}`);
        }
    }, []);

    const getMarketDetailById = async () => {
        const uniqueIds = userStatements.reduce((prev, current) => {
            if (!prev.includes(current.MarketId)) {
                prev.push(current.MarketId);
            }
            return prev;
        }, []);

        const marketDetails = await Promise.all(uniqueIds.map((id) => handleFetchMarketDetail(id)));
        setMarketsDetail([...marketsDetail, ...marketDetails]);
        setIsMarketLoading(false);
    };

    const handleFetchStatements = useCallback(async () => {
        try {
            setIsMarketLoading(true);
            let response = await syncCustomerTickets(token);
            if (!!response && response.ErrorCode === 0) {
                setUserStatements([...userStatements, ...response.Result.Tickets]);
            }
        } catch (error) {
            console.error(`Error getting statement, ${error}`);
        }
    }, []);

    useEffect(() => {
        handleFetchStatements();
    }, [refreshStatement]);

    useEffect(() => {
        if (userStatements && userStatements.length > 0) {
            getMarketDetailById();
        }
    }, [userStatements]);

    return (
        <>
            {nickName && currentMenu === MENU_TYPE.STATEMENT && !currentMarketID && (
                <>
                    {isMarketLoading && <Loading />}
                    {!isMarketLoading &&
                        (userStatements && userStatements.length > 0 && marketsDetail && marketsDetail.length > 0 ? (
                            <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
                                {userStatements.map((ticket) => {
                                    const ticketDetial = marketsDetail.find((detail) => detail.id === ticket.MarketId);
                                    const ticketStatement = {
                                        id: ticket.MarketId,
                                        yesAmount: ticket.BetTypeName === BET_TYPE.YES ? ticket.Stake : 0,
                                        noAmount: ticket.BetTypeName === BET_TYPE.NO ? ticket.Stake : 0,
                                        win: ticket.Win
                                    };
                                    const ticketInfo = { ...ticketDetial, ...ticketStatement };
                                    return <StatementMarketCard market={ticketInfo} />;
                                })}
                            </Grid>
                        ) : (
                            <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", width: "100%" }}>
                                    <EmptyPage />
                                </Box>
                            </Grid>
                        ))}
                </>
            )}
        </>
    );
};
