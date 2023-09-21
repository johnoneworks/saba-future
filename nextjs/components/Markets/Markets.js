import { EmptyPage } from "@/components/EmptyPage/EmptyPage";
import { Loading } from "@/components/Loading/Loading";
import MarketCard from "@/components/MarketCard/MarketCard";
import { MENU_TYPE } from "@/constants/Constant";
import { useAccountStore } from "@/store/useAccountStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { useMarketsStore } from "@/store/useMarketsStore";
import { useMenuStore } from "@/store/useMenuStore";
import AddIcon from "@mui/icons-material/Add";
import { Box, Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import classnames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./Markets.module.scss";

const ShowMarkets = (props) => {
    const router = useRouter();
    const { markets } = useMarketsStore();
    const { nickName, showTest, isEditable } = props;

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
    }, [showTest, router.pathname, markets.length]);

    return (
        <>
            {openMarkets &&
                openMarkets.reduce((accumulator, market) => {
                    accumulator.push(
                        <Grid item xs={12} sm={6} md={4} key={market.id} className={styles.marketCard}>
                            <MarketCard market={market} currentUser={nickName} isClosed={false} isTest={market.isTest} isEditable={isEditable} />
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
                                <MarketCard market={market} currentUser={nickName} isClosed={true} isTest={market.isTest} />
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
    const router = useRouter();
    const { nickName, isAdmin } = useAccountStore();
    const { markets } = useMarketsStore();

    const { currentMenu, currentMarketID } = useMenuStore();
    const { isMarketLoading } = useLoadingStore();
    const [showTest, setShowTest] = useState(false);
    const hasLogin = !!nickName;

    const handleRedirectToAdmin = () => {
        router.push({
            pathname: `/admin`
        });
    };

    return (
        <>
            {currentMenu === MENU_TYPE.MARKET && !currentMarketID && (
                <>
                    {isMarketLoading && <Loading />}
                    {!isMarketLoading && markets && (
                        <>
                            {nickName && isAdmin && (
                                <>
                                    <div className={classnames(styles.buttonContainer)}>
                                        <div className={classnames(styles.creatMarketButton)} onClick={handleRedirectToAdmin}>
                                            <AddIcon />
                                            <span>Create Market</span>
                                        </div>
                                    </div>
                                    <div>
                                        <FormControlLabel
                                            label="Show Test Markets"
                                            sx={{ mt: 2, mb: 1 }}
                                            control={<Checkbox checked={showTest} onChange={(e) => setShowTest(!showTest)} />}
                                        />
                                    </div>
                                </>
                            )}
                            <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
                                <ShowMarkets nickName={nickName} showTest={showTest} isEditable={hasLogin ? isAdmin : false} />
                            </Grid>
                        </>
                    )}
                </>
            )}
        </>
    );
};
