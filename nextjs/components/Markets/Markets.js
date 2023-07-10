import { EmptyPage } from "@/components/EmptyPage/EmptyPage";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import MarketCard from "@/components/MarketCard/MarketCard";
import { MARKET_STATUS, MENU_TYPE } from "@/constants/Constant";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { MarketContext } from "@/contexts/MarketContext";
import { PageContext } from "@/contexts/PageContext";
import styles from "@/styles/Home.module.scss";
import { Box, Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import { useContext, useState } from "react";

const ShowMarkets = (props) => {
    const { marketStatus, markets, account, showTest } = props;
    const isClose = marketStatus !== MARKET_STATUS.OPEN;

    return (
        <>
            {markets &&
                markets.reduce((accumulator, market) => {
                    const isAvailable = isClose ? market.marketClosed : !market.marketClosed;
                    if (isAvailable && (!market.isTest || (showTest && market.isTest))) {
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
    const { account, smartAccount } = useContext(BiconomyAccountContext);
    const { currentMenu, currentMarketID } = useContext(PageContext);
    const { isMarketLoading } = useContext(LoadingContext);
    const { markets } = useContext(MarketContext);
    const [showTest, setShowTest] = useState(false);

    return (
        <>
            {account && currentMenu === MENU_TYPE.MARKET && !currentMarketID && (
                <>
                    {isMarketLoading && markets && <LoadingSkeleton amount={markets.length} />}

                    {!isMarketLoading && markets && (
                        <>
                            {smartAccount.isAdminUser && (
                                <div>
                                    <FormControlLabel
                                        label="Show Test Markets"
                                        sx={{ mt: 2, mb: 1 }}
                                        control={<Checkbox checked={showTest} onChange={(e) => setShowTest(!showTest)} />}
                                    />
                                </div>
                            )}
                            {markets.length > 0 ? (
                                <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
                                    <ShowMarkets marketStatus={MARKET_STATUS.OPEN} markets={markets} account={account} showTest={showTest} />
                                    <Typography variant="h6" sx={{ width: "100%", textAlign: "center", my: 1, mt: 2 }}>
                                        Closed Markets
                                    </Typography>
                                    <ShowMarkets marketStatus={MARKET_STATUS.CLOSE} markets={markets} account={account} showTest={showTest} />
                                </Grid>
                            ) : (
                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                                    <EmptyPage />
                                </Box>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
};
