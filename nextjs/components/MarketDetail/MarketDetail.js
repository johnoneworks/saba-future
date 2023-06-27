import { BetArea } from "@/components/BetArea/BetArea";
import ChartContainer from "@/components/ChartContainer/ChartContainer";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import useGetMarketDetail from "@/hooks/useGetMarketDetail";
import { Avatar, Box, Grid, Link, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useContext } from "react";
import styles from "./MarketDetail.module.scss";

/** TODO LIST:
 1. Return back button √
 2. Add loading 
 3. Add error handling
 4. Add chart √
 5. update bet button
 6. 下注後，要更新資料
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
    "border-radius": "4px",
    "margin-right": "4px",
    width: "56px",
    height: "56px"
});

const MarketTitle = (props) => {
    const { title, endTimestamp, totalAmount } = props;
    const endTime = endTimestamp ? endTimestamp.toLocaleString() : "N/A";
    const totalSureAmount = `${totalAmount}`;

    return (
        <Box className={styles.marketTitle}>
            <Box sx={{ display: "flex", mb: "10px" }}>
                <CustomAvatar>
                    <Box component="img" src="/placeholder.jpg" alt="placeholder" sx={{ width: "100%", height: "100%" }} />
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
    const { description, resolverUrl } = props;
    return (
        <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Description
            </Typography>
            {description && <Typography variant="body2">{description}</Typography>}
            <Box className={styles.descriptionBox} sx={{ my: 2, py: 2, bgcolor: "grey.200", borderRadius: 1 }}>
                <Typography variant="subtitle2" component="span" sx={{ px: 1 }}>
                    Resolution Source :{" "}
                    <Link href={resolverUrl} color="primary">
                        {resolverUrl}
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default function MarketDetail() {
    const { account } = useContext(BiconomyAccountContext);
    const { marketDetail } = useGetMarketDetail();
    return (
        <>
            {account && marketDetail && (
                <>
                    <MarketTitle title={marketDetail?.title} endTimestamp={marketDetail?.endTimestamp} totalAmount={marketDetail?.totalAmount} />
                    <Grid container spacing={2} className={styles.marketContainer}>
                        {marketDetail.isClose == false && (
                            <Grid item xs={12} md={6} className={styles.betAreaContainer}>
                                <BetArea id={marketDetail?.id} market={marketDetail} />
                            </Grid>
                        )}
                        <Grid item xs={12} md={6} className={styles.chartContainer}>
                            <ChartContainer />
                        </Grid>
                    </Grid>
                    <MarketDescription description={marketDetail?.description} resolverUrl={marketDetail?.resolverUrl} />
                </>
            )}
        </>
    );
}
