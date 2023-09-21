import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import MarketDetail from "@/components/MarketDetail/MarketDetail";
import { Markets } from "@/components/Markets/Markets";
import { Statement } from "@/components/Statement/Statement";
import { useAccountStore } from "@/store/useAccountStore";
import { useMenuStore } from "@/store/useMenuStore";
import styles from "@/styles/Home.module.scss";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
    const router = useRouter();
    const { menu } = router.query;
    const { account } = useAccountStore();
    const { currentMenu, currentMarketID } = useMenuStore();
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        if (!menu && currentMenu) {
            router.push({
                pathname: `/`,
                query: { menu: currentMenu }
            });
        }
    }, [account, currentMenu, currentMarketID]);

    useEffect(() => {
        setShowLoading(true);
        const timer = setTimeout(() => {
            setShowLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {showLoading && (
                <div className={styles["animation-container"]}>
                    <LoadingAnimation />
                </div>
            )}
            <Box className={styles.homeContainer}>
                <Header />
                <Box className={styles.homeContent}>
                    <Markets />
                    <Statement />
                    {account && currentMarketID && <MarketDetail />}
                </Box>
                <Footer />
            </Box>
        </>
    );
}
