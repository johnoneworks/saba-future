import { Header } from "@/components/Header/Header";
import MarketDetail from "@/components/MarketDetail/MarketDetail";
import { Markets } from "@/components/Markets/Markets";
import { Statement } from "@/components/Statement/Statement";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import styles from "@/styles/Home.module.scss";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { PageContext } from "../contexts/PageContext";
/**
 * TODO:
 * 1. add market loading √
 * 2. 更新market √
 * 3. 切換Tab邏輯 √
 * 4. useGetBalance hook √
 * 5. 把 markets 抽出去做成一個 component √
 * 6. 優化 router
 */

export default function Home() {
    const router = useRouter();
    const { menu } = router.query;
    const { account } = useContext(BiconomyAccountContext);
    const { currentMenu, currentMarketID } = useContext(PageContext);

    useEffect(() => {
        if (account && !menu) {
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
                <Statement />
                {account && currentMarketID && <MarketDetail />}
            </Box>
        </Box>
    );
}
