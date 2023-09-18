import { BetArea } from "@/components/BetArea/BetArea";
import ChartContainer from "@/components/ChartContainer/ChartContainer";
import { TestDataMark } from "@/components/TestDataMark/TestDataMark";
import { BACKUP_IMAGE } from "@/constants/Constant";
import { API_MARKET_STATUS } from "@/constants/MarketCondition";
import syncMarketDetail from "@/service/market/getMarketDetail";
import { useAccountStore } from "@/store/useAccountStore";
import { useMenuStore } from "@/store/useMenuStore";
import { OpenNewWindow } from "@/utils/OpenNewWindow";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import BlockIcon from "@mui/icons-material/Block";
import { Avatar, Box, Grid, Link, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/system";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import styles from "./MarketDetail.module.scss";

const CustomTypography = styled(Typography)({
    fontSize: "12px",
    fontWeight: "normal",
    transform: "scale(0.8)",
    lineHeight: 0.5
});

const CustomAvatar = styled(Avatar)({
    borderRadius: "4px",
    marginRight: "4px",
    width: "56px",
    height: "56px"
});

const MarketTitle = (props) => {
    const { title, endTimestamp, totalAmount, imageHash, isTest, isMarketSuspended, isTimeOver } = props;
    const endTime = endTimestamp ? endTimestamp.toLocaleString() : "N/A";

    return (
        <Box className={styles.marketTitle}>
            {isTest && <TestDataMark />}
            {isMarketSuspended && (
                <Chip
                    icon={<BlockIcon fontSize="small" />}
                    label="Suspended"
                    variant="outlined"
                    size="small"
                    color="error"
                    sx={{ display: "flex", justifyContent: "center", width: "110px", alignItems: "center", margin: "0 0 10px 0" }}
                />
            )}
            {isTimeOver && (
                <Chip
                    icon={<AccessAlarmIcon fontSize="small" />}
                    label="Time Over"
                    variant="outlined"
                    size="small"
                    color="error"
                    sx={{ display: "flex", justifyContent: "center", width: "110px", alignItems: "center", margin: "0 0 10px 0" }}
                />
            )}
            <Box sx={{ display: "flex", mb: "10px" }}>
                <CustomAvatar>
                    <Box component="img" src={imageHash} alt="titleImage" sx={{ width: "100%", height: "100%" }} />
                </CustomAvatar>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", ml: "8px" }}>
                    {title}
                </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, ml: 1 }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <Typography sx={{ lineHeight: 1 }} variant="caption" color="grey.500" noWrap>
                        Market Ends on
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }} noWrap color="grey.700">
                        {endTime}
                    </Typography>
                </Box>
                <Box className={styles.totalVolume}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", mr: 0.5 }} color="grey.700" noWrap>
                        Total Volume
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", transform: "translateY(-3px)" }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }} noWrap color="grey.700">
                            {totalAmount}
                        </Typography>
                        <CustomTypography color="grey.500">SURE</CustomTypography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

const MarketDescription = (props) => {
    const { title, description, resolverUrl } = props;

    return (
        <Box sx={{ width: "100%" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Description
            </Typography>
            {description && <Typography variant="body2">{description}</Typography>}
            <Box className={styles.descriptionBox} sx={{ my: 2, py: 2, bgcolor: "grey.200", borderRadius: 1 }}>
                <Typography variant="subtitle2" component="" sx={{ px: 1 }}>
                    Resolution Source :{" "}
                    <Link color="primary" sx={{ display: "block", wordBreak: "break-all" }} onClick={() => OpenNewWindow(resolverUrl, title)}>
                        {resolverUrl}
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default function MarketDetail() {
    const [marketDetail, setMarketDetail] = useState({
        id: 0,
        title: "",
        imageHash: BACKUP_IMAGE,
        endTimestamp: "",
        endDate: "",
        resolverUrl: "",
        description: "",
        yesAmount: 0,
        noAmount: 0,
        isClose: false,
        isTest: false,
        isSuspended: false
    });
    const { currentMarketID } = useMenuStore();
    const { account, token } = useAccountStore();
    const isMarketClose = marketDetail?.isClose === true;
    const isMarketSuspended = marketDetail?.isSuspended === true;
    const isTimeOver = marketDetail?.endDate < moment();
    const totalAmount = Number(marketDetail.yesAmount) + Number(marketDetail.noAmount);

    const handleFetchMarketDetail = useCallback(async () => {
        const response = await syncMarketDetail({ marketId: currentMarketID, token: token });
        if (!!response && response.ErrorCode === 0) {
            const detail = response.Result.MarketDetail;
            const responseEndTime = detail.EndTime;
            const endTimeFormat = moment(responseEndTime).format("MMMM D, YYYY HH:mm");
            const dateFormat = moment.unix(responseEndTime / 1000);
            setMarketDetail({
                id: detail.MarketId,
                title: detail.Title,
                imageHash: detail.ImageHash ? detail.ImageHash : BACKUP_IMAGE,
                endTimestamp: endTimeFormat,
                endDate: dateFormat,
                resolverUrl: detail.ResolveUrl,
                description: detail.Description,
                yesAmount: detail.BetInfo.Yes,
                noAmount: detail.BetInfo.No,
                isClose: detail.Status === API_MARKET_STATUS.CLOSED,
                isTest: detail.IsTest,
                isSuspended: detail.Status === API_MARKET_STATUS.SUSPENDED
            });
        }
    }, [currentMarketID]);

    useEffect(() => {
        handleFetchMarketDetail();
    }, [currentMarketID]);

    return (
        <>
            {account && marketDetail && (
                <>
                    <MarketTitle
                        title={marketDetail?.title}
                        endTimestamp={marketDetail?.endTimestamp}
                        totalAmount={totalAmount}
                        imageHash={marketDetail?.imageHash}
                        isTest={marketDetail?.isTest}
                        isMarketSuspended={!isMarketClose && isMarketSuspended}
                        isTimeOver={!isMarketClose && isTimeOver}
                    />
                    <Grid container spacing={2} className={styles.marketContainer}>
                        {!isMarketClose && !isMarketSuspended && !isTimeOver && (
                            <Grid item xs={12} md={6} className={styles.betAreaContainer}>
                                <BetArea
                                    id={marketDetail.id}
                                    yesAmount={marketDetail.yesAmount}
                                    noAmount={marketDetail.noAmount}
                                    handleFetchMarketDetail={handleFetchMarketDetail}
                                />
                            </Grid>
                        )}
                        <Grid item xs={12} md={isMarketClose || isMarketSuspended || isTimeOver ? 12 : 6} className={styles.chartContainer}>
                            <ChartContainer />
                        </Grid>
                    </Grid>
                    <MarketDescription title={marketDetail?.title} description={marketDetail?.description} resolverUrl={marketDetail?.resolverUrl} />
                </>
            )}
        </>
    );
}
