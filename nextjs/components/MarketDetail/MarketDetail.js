import { BetArea } from "@/components/BetArea/BetArea";
import ChartContainer from "@/components/ChartContainer/ChartContainer";
import { TestDataMark } from "@/components/TestDataMark/TestDataMark";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { MarketContext } from "@/contexts/MarketContext";
import { OpenNewWindow } from "@/utils/OpenNewWindow";
import BlockIcon from "@mui/icons-material/Block";
import { Avatar, Box, Grid, Link, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/system";
import { useContext } from "react";
import styles from "./MarketDetail.module.scss";

/** TODO LIST:
 1. Return back button √
 2. Add loading 
 3. Add error handling
 4. Add chart √
 5. update bet button
 6. 下注後，要更新資料 √
 7. 顯示資料 √
 8. 將此頁移到 index.js √
 */

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
    const { title, endTimestamp, totalAmount, imageHash, isTest } = props;
    const endTime = endTimestamp ? endTimestamp.toLocaleString() : "N/A";
    const totalSureAmount = `${totalAmount}`;

    return (
        <Box className={styles.marketTitle}>
            {isTest && <TestDataMark />}
            <Chip
                icon={<BlockIcon fontSize="small" />}
                label="Suspended"
                variant="outlined"
                size="small"
                color="error"
                sx={{ display: "flex", justifyContent: "center", width: "110px", alignItems: "center", margin: "0 0 10px 0" }}
            />
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
                            {totalSureAmount}
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
    const { account } = useContext(BiconomyAccountContext);
    const { marketDetail } = useContext(MarketContext);
    const isMarketClose = marketDetail?.isClose === true;
    const isMarketSuspended = marketDetail?.isSuspended === true;

    return (
        <>
            {account && marketDetail && (
                <>
                    <MarketTitle
                        title={marketDetail?.title}
                        endTimestamp={marketDetail?.endTimestamp}
                        totalAmount={marketDetail?.totalAmount}
                        imageHash={marketDetail?.imageHash}
                        isTest={marketDetail?.isTest}
                    />
                    <Grid container spacing={2} className={styles.marketContainer}>
                        {!isMarketClose && !isMarketSuspended && (
                            <Grid item xs={12} md={6} className={styles.betAreaContainer}>
                                <BetArea id={marketDetail?.id} market={marketDetail} />
                            </Grid>
                        )}
                        <Grid item xs={12} md={(isMarketClose || isMarketSuspended) ? 12 : 6} className={styles.chartContainer}>
                            <ChartContainer />
                        </Grid>
                    </Grid>
                    <MarketDescription title={marketDetail?.title} description={marketDetail?.description} resolverUrl={marketDetail?.resolverUrl} />
                </>
            )}
        </>
    );
}
