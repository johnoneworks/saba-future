import AdminMarketCard from "@/components/AdminMarketCard";
import { AdminHeader } from "@/components/Header/AdminHeader";
import { BACKUP_IMAGE, MARKET_STATUS } from "@/constants/Constant";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import styles from "@/styles/Home.module.scss";
import { Box, Button, Grid, Typography } from "@mui/material";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

/**
 * TODO:
 * 1. 畫面優化
 * 2. confirm page
 */

const ShowMarkets = (props) => {
    const { marketStatus, markets } = props;
    const isClose = marketStatus !== MARKET_STATUS.OPEN;

    return (
        <>
            {isClose && (
                <Typography variant="h6" sx={{ width: "100%", textAlign: "center", my: 1, mt: 2 }}>
                    Closed Markets
                </Typography>
            )}
            {markets &&
                markets.reduce((accumulator, market) => {
                    const isAvailable = isClose ? market.hasResolved : !market.hasResolved;
                    if (isAvailable) {
                        accumulator.push(
                            <div key={market.id} className={styles.adminMarketCard}>
                                <AdminMarketCard id={market.id} market={market} />
                            </div>
                        );
                    }
                    return accumulator;
                }, [])}
        </>
    );
};

export default function Markets() {
    const [markets, setMarkets] = useState([]);
    const { predictionWorldContract } = useContext(BiconomyAccountContext);

    const getMarkets = async () => {
        try {
            let marketCount = await predictionWorldContract.totalMarkets();
            let markets = [];

            for (let i = 0; i < marketCount; i++) {
                let market = await predictionWorldContract.markets(i);
                markets.push({
                    id: market.id,
                    question: market.info.question,
                    imageHash: market.info.creatorImageHash ? market.info.creatorImageHash : BACKUP_IMAGE,
                    totalAmount: market.totalAmount,
                    totalYesAmount: market.totalYesAmount,
                    totalNoAmount: market.totalNoAmount,
                    hasResolved: market.marketClosed,
                    timestamp: market.info.timestamp,
                    endTimestamp: market.info.endTimestamp
                });
            }
            setMarkets(markets);
        } catch (error) {
            console.error(`Error getting markets, ${error}`);
        }
    };

    useEffect(() => {
        getMarkets();
    }, []);

    return (
        <>
            <Box className={styles.homeContainer}>
                <AdminHeader />
                <Box className={styles.adminMarketContent}>
                    <Link href="/admin">
                        <Button style={{ backgroundColor: "#1A84F2" }} variant="contained" fullWidth sx={{ mt: 2, mb: 2 }}>
                            Back
                        </Button>
                    </Link>
                    <Grid columns={{ xs: 12, sm: 12, md: 12 }}>
                        <main className="w-full flex flex-row flex-wrap py-4 pb-6">
                            <ShowMarkets marketStatus={MARKET_STATUS.OPEN} markets={markets} />
                            <ShowMarkets marketStatus={MARKET_STATUS.CLOSE} markets={markets} />
                        </main>
                    </Grid>
                </Box>
            </Box>
        </>
    );
}
