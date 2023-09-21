import { Header } from "@/components/Header/Header";
import MarketEditForm from "@/components/MarketEditForm/MarketEditForm";
import { API_CREATE_MARKET } from "@/constants/api";
import { useLoadingStore } from "@/store/useLoadingStore";
import { Box, Button, Container } from "@mui/material";
import Link from "next/link";
import { useTranslation } from "react-i18next";

/**
 * TODO:
 * 1. 畫面優化
 * 2. is production 的條件
 */

// 取出要用的資料
// 送 api
export default function Admin() {
    const { isPageLoading } = useLoadingStore();
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%"
            }}
        >
            <Header />
            {!isPageLoading && (
                <Container maxWidth="md" component="main">
                    <Link href="/admin/markets">
                        <Button style={{ backgroundColor: "#1A84F2" }} variant="contained" fullWidth sx={{ mt: 2, mb: 2 }}>
                            {t("admin_see_all")}
                        </Button>
                    </Link>
                    <MarketEditForm apiPath={API_CREATE_MARKET} />
                </Container>
            )}
        </Box>
    );
}
