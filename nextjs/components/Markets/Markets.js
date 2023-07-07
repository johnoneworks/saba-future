import { EmptyPage } from "@/components/EmptyPage/EmptyPage";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import MarketCard from "@/components/MarketCard/MarketCard";
import { MARKET_STATUS, MENU_TYPE } from "@/constants/Constant";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { MarketContext } from "@/contexts/MarketContext";
import { PageContext } from "@/contexts/PageContext";
import styles from "@/styles/Home.module.scss";
import { Box, Grid, Typography } from "@mui/material";
import { useContext } from "react";

const ShowMarkets = (props) => {
    const { marketStatus, markets, account } = props;
    const isClose = marketStatus !== MARKET_STATUS.OPEN;

    return (
        <>
            {markets &&
                markets.reduce((accumulator, market) => {
                    const isAvailable = isClose ? market.marketClosed : !market.marketClosed;
                    if (isAvailable) {
                        accumulator.push(
                            <Grid item xs={12} sm={6} md={4} key={market.id} className={styles.marketCard}>
                                <MarketCard market={market} currentUser={account} isClosed={isClose} />
                            </Grid>
                        );
                    }
                    return accumulator;
                }, [])}
        </>
    );
};

export const Markets = () => {
    const { account } = useContext(BiconomyAccountContext);
    const { currentMenu, currentMarketID } = useContext(PageContext);
    const { isMarketLoading } = useContext(LoadingContext);
    const { markets } = useContext(MarketContext);

    return (
        <>
            {account && currentMenu === MENU_TYPE.MARKET && !currentMarketID && (
                <>
                    {isMarketLoading && markets && <LoadingSkeleton amount={markets.length} />}
                    {!isMarketLoading && markets && markets.length > 0 ? (
                        <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
                            <ShowMarkets marketStatus={MARKET_STATUS.OPEN} markets={markets} account={account} />
                            <Typography variant="h6" sx={{ width: "100%", textAlign: "center", my: 1, mt: 2 }}>
                                Closed Markets
                            </Typography>
                            <ShowMarkets marketStatus={MARKET_STATUS.CLOSE} markets={markets} account={account} />
                        </Grid>
                    ) : (
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                            <EmptyPage />
                        </Box>
                    )}
                </>
            )}
        </>
    );
};
