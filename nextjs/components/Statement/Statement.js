import { EmptyPage } from "@/components/EmptyPage/EmptyPage";
import { Loading } from "@/components/Loading/Loading";
import StatementMarketCard from "@/components/StatementMarketCard";
import { BACKUP_IMAGE, BET_TYPE, MENU_TYPE } from "@/constants/Constant";
import syncMarketDetail from "@/service/market/getMarketDetail";
import syncCustomerTickets from "@/service/ticket/getCustomerTickets";
import { useLoadingStore } from "@/store/useLoadingStore";
import { useMenuStore } from "@/store/useMenuStore";
import { usePlayerInfoStore } from "@/store/usePlayerInfoStore";
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
export const Statement = () => {
    const { setHasGetFirstInformation } = usePlayerInfoStore();
    const { currentMenu, currentMarketID } = useMenuStore();
    const { isMarketLoading, setIsMarketLoading } = useLoadingStore();
    const [userStatements, setUserStatements] = useState([]);
    const [marketsDetail, setMarketsDetail] = useState([]);

    const handleFetchMarketDetail = useCallback(
        async (currentMarketID) => {
            const response = await syncMarketDetail({ marketId: currentMarketID });
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
                    outcome: detail.Outcome
                };
                if (!marketsDetail.some((item) => item.id === data.id)) {
                    let array = marketsDetail;
                    array.push(data);
                    setMarketsDetail(array);
                }
            }
        },
        [marketsDetail]
    );

    const getMarketDetailById = async (item) => {
        const uniqueIds = [...new Set(item.map((item) => item.MarketId))];
        await Promise.all(
            uniqueIds.map(async (id) => {
                await handleFetchMarketDetail(id);
            })
        );
    };

    const getStatements = useCallback(async () => {
        try {
            setIsMarketLoading(true);
            let response = await syncCustomerTickets();
            if (!!response && response.ErrorCode === 0) {
                await getMarketDetailById(response.Result.Tickets);
                let formatTickets = [];
                response.Result.Tickets.map((item) => {
                    const newData = {
                        id: item.MarketId,
                        yesAmount: item.BetTypeName === BET_TYPE.YES ? item.Stake : 0,
                        noAmount: item.BetTypeName === BET_TYPE.NO ? item.Stake : 0,
                        win: item.Win
                    };
                    formatTickets.push(newData);
                });
                statementInfo(formatTickets);
            }
            setHasGetFirstInformation(true);
            setIsMarketLoading(false);
        } catch (error) {
            console.error(`Error getting statement, ${error}`);
        }
    }, []);

    const statementInfo = useCallback(async (formatTickets) => {
        const allData = formatTickets.reduce((prev, current) => {
            const detail = marketsDetail.find((market) => market.id === current.id);
            const mergeData = { ...current, ...detail };
            prev.push(mergeData);
            return prev;
        }, []);
        setUserStatements(allData);
    }, []);

    useEffect(() => {
        getStatements();
    }, []);

    return (
        <>
            {/* TODO: 轉 Web2.0 account login logic */}
            {currentMenu === MENU_TYPE.STATEMENT && !currentMarketID && (
                <>
                    {isMarketLoading && <Loading />}
                    {!isMarketLoading &&
                        (userStatements && userStatements.length > 0 ? (
                            <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
                                {userStatements.map((market) => (
                                    <StatementMarketCard market={market} />
                                ))}
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
