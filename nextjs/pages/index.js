import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import MarketDetail from "@/components/MarketDetail/MarketDetail";
import { Markets } from "@/components/Markets/Markets";
import { Statement } from "@/components/Statement/Statement";
import { useAccountStore } from "@/store/useAccountStore";
import { useMenuStore } from "@/store/useMenuStore";
import styles from "@/styles/Home.module.scss";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Home() {
    const router = useRouter();
    const { menu } = router.query;
    const { account } = useAccountStore();
    const { currentMenu, currentMarketID } = useMenuStore();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (!menu && currentMenu) {
            router.push({
                pathname: `/`,
                query: { menu: currentMenu }
            });
        }
    }, [account, currentMenu, currentMarketID]);
    const handleSwitchLanguage = (lan) => {
        i18n.changeLanguage(lan);
    };

    return (
        <Box className={styles.homeContainer}>
            <Header />
            <Box className={styles.homeContent}>
                {/* i18 test 可以拿掉 */}
                <button
                    onClick={() => {
                        handleSwitchLanguage("en");
                    }}
                >
                    English
                </button>
                <button
                    onClick={() => {
                        handleSwitchLanguage("ind");
                    }}
                >
                    English(India)
                </button>
                <button
                    onClick={() => {
                        handleSwitchLanguage("vn");
                    }}
                >
                    Tiếng Việt
                </button>
                <button
                    onClick={() => {
                        handleSwitchLanguage("th");
                    }}
                >
                    ภาษาไทย
                </button>
                <button
                    onClick={() => {
                        handleSwitchLanguage("idn");
                    }}
                >
                    Indonesian
                </button>
                <div>{t("saba_orb")}</div>
                <Markets />
                {account && <Statement />}
                {/* 轉 Web2.0 先註解 account */}
                {/* {account && currentMarketID && <MarketDetail />} */}
                {currentMarketID && <MarketDetail />}
            </Box>
            <Footer />
        </Box>
    );
}
