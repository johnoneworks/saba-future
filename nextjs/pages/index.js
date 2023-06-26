import { Header } from "@/components/Header/Header";
import MarketDetail from "@/components/MarketDetail/MarketDetail";
import { Markets } from "@/components/Markets/Markets";
import { Statement } from "@/components/Statement/Statement";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { PageContext } from "../contexts/PageContext";
import styles from "../styles/Home.module.css";
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
    const { menu, marketId } = router.query;
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
        <div className={styles.container}>
            <Header />
            <main className="w-full flex flex-col sm:flex-row flex-wrap sm:flex-nowrap py-4 flex-grow max-w-5xl">
                <Markets />
                <Statement />
                {account && currentMarketID && <MarketDetail />}
            </main>
        </div>
    );
}
