import { BetArea } from "@/components/BetArea/BetArea";
import ChartContainer from "@/components/ChartContainer/ChartContainer";
import { Header } from "@/components/Header/Header";
import PageLoading from "@/components/LoadingPage/PageLoading";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { Avatar, Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import styles from "./MarketDetail.module.scss";

/** TODO LIST:
 * 此頁已不再維護
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

export default function Detail() {
    const router = useRouter();
    const { id } = router.query;
    const { account, predictionWorldContract } = useContext(BiconomyAccountContext);
    const { isPageLoading, setIsPageLoading } = useContext(LoadingContext);

    const [market, setMarket] = useState({
        title: "title of market",
        endTimestamp: "1681681545",
        totalAmount: 0,
        totalYesAmount: 0,
        totalNoAmount: 0,
        description: "",
        resolverUrl: null
    });

    const getMarket = useCallback(
        async (id, predictionWorldContract) => {
            try {
                const market = await predictionWorldContract.markets(id);
                const date = moment.unix(market.info.endTimestamp / 1000).format("MMMM D, YYYY");
                setMarket({
                    title: market.info.question,
                    endTimestamp: date,
                    totalAmount: market.totalAmount,
                    totalYesAmount: market.totalYesAmount,
                    totalNoAmount: market.totalNoAmount,
                    description: market.info.description,
                    resolverUrl: market.info.resolverUrl
                });
            } catch (error) {
                console.error(`Error getting market detail, ${error}`);
            }
        },
        [id, predictionWorldContract]
    );

    useEffect(() => {
        if (id && predictionWorldContract) {
            getMarket(id, predictionWorldContract);
        }
    }, [router.isReady, account, getMarket]);

    return (
        <div className="flex flex-col justify-center items-center h-full">
            <PageLoading />
            {/* Header NavBar */}
            <Header />
            {!isPageLoading && (
                <div className="w-full flex flex-col sm:flex-row py-4 max-w-5xl">
                    <div className="w-full flex flex-col pt-1">
                        {/* market title */}
                        <MarketTitle title={market?.title} endTimestamp={market?.endTimestamp} totalAmount={market?.totalAmount} />
                        {/* market container */}
                        <Box className={styles.marketContainer}>
                            {/* 下注區 */}
                            <Box className={styles.betArea}>
                                <BetArea id={id} market={market} />
                            </Box>
                            {/* TODO: Market 的Yes No 詳細資料 */}
                            <Box className={styles.chart}>
                                <ChartContainer questionId={id} />
                            </Box>
                        </Box>
                        {/* Market Description */}
                        <MarketDescription description={market?.description} resolverUrl={market?.resolverUrl} />
                    </div>
                </div>
            )}
        </div>
    );
}
