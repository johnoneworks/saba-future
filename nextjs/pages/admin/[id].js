import { Header } from "@/components/Header/Header";
import MarketEditForm from "@/components/MarketEditForm/MarketEditForm";
import { API_EDIT_MARKET } from "@/constants/api";
import syncMarketDetail from "@/service/market/getMarketDetail";
import { useAccountStore } from "@/store/useAccountStore";
import { Box, Button, Container, Link } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * TODO:
 * 1. 暫時使用之編輯畫面，UI 團隊可以重新調整，目前感覺應該是 Dialog 更為適合
 */

export default function EditMarketPage() {
    return <EditMarket />;
}

const EditMarket = () => {
    const router = useRouter();
    const { id } = router.query;
    const [marketDetail, setMarketDetail] = useState({});
    const { t } = useTranslation();
    const { token } = useAccountStore();

    const getMarket = async () => {
        const response = await syncMarketDetail({ marketId: id, token: token });

        if (response && response.ErrorCode !== 0) {
            router.push("/admin/markets");
        }
        if (response && response.ErrorCode === 0) {
            const {
                Result: { MarketDetail }
            } = response;

            const editPropsData = {
                title: MarketDetail.Title,
                description: MarketDetail.Description,
                imageUrl: MarketDetail.ImageUrl,
                resolverUrl: MarketDetail.ResolveUrl,
                timestamp: MarketDetail.EndTime,
                isTest: MarketDetail.IsTest
            };
            setMarketDetail(editPropsData);
        }
    };

    useEffect(() => {
        if (id) {
            getMarket();
        }
    }, [id]);

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
            <Container maxWidth="md" component="main">
                <Link href="/?menu=Market">
                    <Button style={{ backgroundColor: "#1A84F2" }} variant="contained" fullWidth sx={{ mt: 2, mb: 2 }}>
                        {t("all_markets")}
                    </Button>
                </Link>
                <MarketEditForm editPropsData={marketDetail} apiPath={API_EDIT_MARKET} marketId={id} />
            </Container>
        </Box>
    );
};
