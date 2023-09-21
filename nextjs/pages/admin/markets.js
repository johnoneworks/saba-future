import AdminMarketCard from "@/components/AdminMarketCard";
import { Header } from "@/components/Header/Header";
import { useMarketsStore } from "@/store/useMarketsStore";
import styles from "@/styles/Home.module.scss";
import { Box, Button, Grid } from "@mui/material";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const ShowMarkets = (props) => {
    const { markets } = props;
    const { t } = useTranslation();

    return (
        <>
            {markets &&
                markets.reduce((accumulator, market) => {
                    const isClosed = !!market.marketClosed;
                    if (!isClosed) {
                        accumulator.push(
                            <div key={market.id} className={styles.adminMarketCard}>
                                <div>{`${t("is_suspend")}: ${!!market.isSuspended ? t("true") : t("false")}`}</div>
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
    const { markets } = useMarketsStore();
    const { t } = useTranslation();

    return (
        <>
            <Box className={styles.homeContainer}>
                <Header />
                <Box className={styles.adminMarketContent}>
                    <Link href="/admin">
                        <Button style={{ backgroundColor: "#1A84F2" }} variant="contained" fullWidth sx={{ mt: 2, mb: 2 }}>
                            {t("createmarket")}
                        </Button>
                    </Link>
                    <Grid columns={{ xs: 12, sm: 12, md: 12 }}>
                        <main className="w-full flex flex-row flex-wrap py-4 pb-6">
                            <ShowMarkets markets={markets} />
                        </main>
                    </Grid>
                </Box>
            </Box>
        </>
    );
}
