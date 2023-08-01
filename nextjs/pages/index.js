import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import MarketDetail from "@/components/MarketDetail/MarketDetail";
import { Markets } from "@/components/Markets/Markets";
import { Statement } from "@/components/Statement/Statement";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { MarketDetailProvider } from "@/contexts/MarketDetailProvider";
import styles from "@/styles/Home.module.scss";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { PageContext } from "../contexts/PageContext";

export default function Home() {
    const router = useRouter();
    const { menu } = router.query;
    const { account } = useContext(BiconomyAccountContext);
    const { currentMenu, currentMarketID } = useContext(PageContext);

    useEffect(() => {
        if (!menu) {
            router.push({
                pathname: `/`,
                query: { menu: currentMenu }
            });
        }
    }, [account]);

    return (
        <Box className={styles.homeContainer}>
            <Header />
            <Box className={styles.homeContent}>
                <Markets />
                {account && <Statement />}
                {account && currentMarketID && (
                    <MarketDetailProvider>
                        <MarketDetail />
                    </MarketDetailProvider>
                )}
            </Box>
            <Footer />
        </Box>
    );
}
