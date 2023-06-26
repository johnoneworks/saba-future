import { BetArea } from "@/components/BetArea/BetArea";
import ChartContainer from "@/components/ChartContainer/ChartContainer";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import useGetMarketDetail from "@/hooks/useGetMarketDetail";
import { Avatar, Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import Image from "next/image";
// import { useRouter } from "next/router";
import { useContext } from "react";
import styles from "./MarketDetail.module.scss";

/** TODO LIST:
 1. Return back button
 2. Add loading 
 3. Add error handling
 4. Add chart √
 5. update bet button
 6. 下注後，要更新資料
 7. 顯示資料 
 8. 將此頁移到 index.js 
 */

const CustomTypography = styled(Typography)({
    fontSize: "12px",
    fontWeight: "normal",
    transform: "scale(0.8)",
    lineHeight: 0.5
});

const MarketTitle = (props) => {
    const { title, endTimestamp, totalAmount } = props;
    const endTime = endTimestamp ? endTimestamp.toLocaleString() : "N/A";
    const totalSureAmount = `${totalAmount}`;

    return (
        <Box className={styles.marketTitle}>
            <Box sx={{ display: "flex", mb: "10px" }}>
                <Avatar sx={{ width: 55, height: 55, borderRadius: "4px" }}>
                    <Image src="/placeholder.jpg" alt="placeholder" width={100} height={100} />
                </Avatar>
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
        <div className="w-2/3 flex flex-col">
            <span className="text-base font-semibold py-3">Description</span>
            {description && <span>{description}</span>}
            <span className="text-base my-3 py-2 bg-gray-100 rounded-xl px-3">
                Resolution Source :{" "}
                <a className="text-blue-700" href={resolverUrl}>
                    {resolverUrl}
                </a>
            </span>
        </div>
    );
};

export default function MarketDetail() {
    const { account } = useContext(BiconomyAccountContext);
    const { marketDetail } = useGetMarketDetail();
    return (
        <>
            {account && marketDetail && (
                <div className="flex flex-col justify-center items-center h-full">
                    <div className="w-full flex flex-col sm:flex-row py-4 max-w-5xl">
                        <div className="w-full flex flex-col pt-1">
                            <MarketTitle title={marketDetail?.title} endTimestamp={marketDetail?.endTimestamp} totalAmount={marketDetail?.totalAmount} />
                            <Box className={styles.marketContainer}>
                                <Box className={styles.betArea}>
                                    <BetArea id={marketDetail?.id} market={marketDetail} />
                                </Box>
                                {console.error("Jim Market Detail ", marketDetail)}
                                <Box className={styles.chart}>
                                    <ChartContainer />
                                </Box>
                            </Box>
                            <MarketDescription description={marketDetail?.description} resolverUrl={marketDetail?.resolverUrl} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
