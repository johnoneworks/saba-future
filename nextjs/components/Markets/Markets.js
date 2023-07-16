import { EmptyPage } from "@/components/EmptyPage/EmptyPage";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import MarketCard from "@/components/MarketCard/MarketCard";
import { MENU_TYPE } from "@/constants/Constant";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { MarketContext } from "@/contexts/MarketContext";
import { PageContext } from "@/contexts/PageContext";
import styles from "@/styles/Home.module.scss";
import { Box, Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";

const ShowMarkets = (props) => {
    const { markets, account, showTest, isEditable } = props;

    const [openMarkets, setOpenMarkets] = useState([]);
    const [closedMarkets, setClosedMarkets] = useState([]);

    const filterMarkets = () => {
        const openMarkets = markets.filter((market) => !market.marketClosed && (!market.isTest || (showTest && market.isTest)));
        const closedMarkets = markets.filter((market) => market.marketClosed && (!market.isTest || (showTest && market.isTest)));
        setOpenMarkets(openMarkets);
        setClosedMarkets(closedMarkets);
    };

    useEffect(() => {
        filterMarkets();
    }, [showTest, markets.length]);

    return (
        <>
            {openMarkets &&
                openMarkets.reduce((accumulator, market) => {
                    accumulator.push(
                        <Grid item xs={12} sm={6} md={4} key={market.id} className={styles.marketCard}>
                            <MarketCard market={market} currentUser={account} isClosed={false} isTest={market.isTest} isEditable={isEditable} />
                        </Grid>
                    );
                    return accumulator;
                }, [])}
            {closedMarkets && closedMarkets.length > 0 && (
                <>
                    <Typography variant="h6" sx={{ width: "100%", textAlign: "center", my: 1, mt: 2 }}>
                        Closed Markets
                    </Typography>
                    {closedMarkets.reduce((accumulator, market) => {
                        accumulator.push(
                            <Grid item xs={12} sm={6} md={4} key={market.id} className={styles.marketCard}>
                                <MarketCard market={market} currentUser={account} isClosed={true} isTest={market.isTest} />
                            </Grid>
                        );
                        return accumulator;
                    }, [])}
                </>
            )}
            {openMarkets.length == 0 && closedMarkets.length == 0 && (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", width: "100%" }}>
                    <EmptyPage />
                </Box>
            )}
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
                            <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
                                <ShowMarkets markets={markets} account={account} showTest={showTest} isEditable={smartAccount.isAdminUser} />
                            </Grid>
                        </>
                    )}
                </>
            )}
        </>
    );
};
