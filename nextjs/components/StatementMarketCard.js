import { BET_TYPE } from "@/constants/Constant";
import { useMenuStore } from "@/store/useMenuStore";
import { convertToDatetimeLocalFormat } from "@/utils/ConvertDate";
import { Avatar, Box, Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

/**
 * TODO:
 * 1. refactor
 */

export default function StatementMarketCard({ market }) {
    const router = useRouter();
    const { currentMenu, setCurrentMarketID } = useMenuStore();
    const userBetType = !!market.yesAmount ? BET_TYPE.YES : BET_TYPE.NO;
    const amount = userBetType === BET_TYPE.YES ? market.yesAmount : market.noAmount;
    const outcome = market.outcome ? BET_TYPE.YES : BET_TYPE.NO;
    const createTime = convertToDatetimeLocalFormat(market.createDate).format("MMMM D, YYYY");
    const endTime = convertToDatetimeLocalFormat(market.endTimestamp).format("MMMM D, YYYY");
    const { t } = useTranslation();

    const handleSelectMarket = () => {
        const marketID = `${market.id}`;
        router.push({
            pathname: `/`,
            query: { menu: currentMenu, marketid: marketID }
        });
        setCurrentMarketID(marketID);
    };

    const CustomAvatar = styled(Avatar)({
        borderRadius: "4px",
        marginRight: "4px",
        width: "56px",
        height: "56px"
    });

    return (
        <Grid item xs={12} sm={6} md={4} key={market.id}>
            <Card
                style={{
                    backgroundColor: market.hasResolved ? "#E4E9F0" : "#fff",
                    boxShadow: market.hasResolved ? "none" : "0px 0px 8px rgba(0, 0, 0, 0.15)"
                }}
            >
                <div onClick={handleSelectMarket}>
                    <CardHeader
                        avatar={
                            <CustomAvatar>
                                <Box component="img" src={market.imageHash} alt="marketImage" sx={{ width: "100%", height: "100%" }} />
                            </CustomAvatar>
                        }
                        title={market.title}
                        titleTypographyProps={{ variant: "subtitle1", fontWeight: "bold" }}
                        sx={{ pb: 0, alignItems: "flex-start" }}
                    />
                    <CardContent sx={{ display: "flex", flexDirection: "column", cursor: "pointer", p: 1, pt: 0 }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                p: 1,
                                m: 1,
                                pb: 0
                            }}
                        >
                            <Box>
                                <Typography variant="subtitle2" gutterBottom sx={{ color: "rgba(0, 0, 0, 0.3)", mb: "3px", lineHeight: 1, pt: "5px" }}>
                                    {t("statement_outcome")}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ color: market.hasResolved ? (outcome === BET_TYPE.YES ? "#3FB06B" : "#E84D4D") : "#1A84F2", fontWeight: "bold" }}
                                >
                                    {market.hasResolved ? outcome.toString() : t("statement_progress")}
                                </Typography>
                            </Box>
                            <Box sx={{ backgroundColor: userBetType === BET_TYPE.YES ? "#3FB06B" : "#E84D4D", pl: 2, pr: 3, borderRadius: "4px" }}>
                                <Typography variant="caption" gutterBottom sx={{ color: "rgba(0, 0, 0, 0.65)", fontWeight: "bold" }}>
                                    {t("statement_your_bet")}
                                </Typography>
                                <Typography variant="body1" sx={{ color: "#fff", fontWeight: "bold", lineHeight: 1 }}>
                                    {`${t(userBetType.toLowerCase())} : ${amount}`}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ pb: "10px" }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ color: "rgba(0, 0, 0, 0.3)", textAlign: "center", mb: 0 }}>
                                {t("statement_amount_add")}
                            </Typography>
                            <Typography variant="body1" sx={{ color: "rgba(0, 0, 0, 0.65)", fontWeight: "bold", textAlign: "center" }}>
                                {`${market.totalYesAmount.toString()} ${t("balance_on")} `}
                                <span style={{ color: "#3FB06B" }}>{t("yes")}</span>
                                {` / ${market.totalNoAmount.toString()} ${t("balance_on")} `}
                                <span style={{ color: "#E84D4D" }}>{t("no")}</span>
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" gutterBottom sx={{ color: "rgba(0, 0, 0, 0.3)", textAlign: "center", mb: 0 }}>
                                {t("statement_period")}
                            </Typography>
                            <Typography variant="body1" sx={{ color: "rgba(0, 0, 0, 0.65)", fontWeight: "bold", textAlign: "center" }}>
                                {`${createTime} / ${endTime}`}
                            </Typography>
                        </Box>
                    </CardContent>
                </div>
            </Card>
        </Grid>
    );
}
