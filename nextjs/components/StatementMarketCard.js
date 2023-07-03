import { BACKUP_IMAGE, BET_TYPE } from "@/constants/Constant";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { PageContext } from "@/contexts/PageContext";
import useGetMarketDetail from "@/hooks/useGetMarketDetail";
import { Avatar, Box, Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useRouter } from "next/router";
import { useContext } from "react";
import { convertBigNumberToDate } from "../utils/ConvertDate";

/**
 * TODO:
 * 1. refactor
 */

export default function StatementMarketCard({ market }) {
    const router = useRouter();
    const { currentMenu, setCurrentMarketID } = useContext(PageContext);
    const { predictionWorldContract } = useContext(BiconomyAccountContext);
    const { updateMarketDetail } = useGetMarketDetail();
    const userBetType = !!market.yesAmount ? BET_TYPE.YES : BET_TYPE.NO;
    const amount = userBetType === BET_TYPE.YES ? market.yesAmount : market.noAmount;
    const outcome = market.outcome ? BET_TYPE.YES : BET_TYPE.NO;

    const handleSelectMarket = () => {
        const marketID = `${market.id}`;
        router.push({
            pathname: `/`,
            query: { menu: currentMenu, marketid: marketID }
        });
        setCurrentMarketID(marketID);
        updateMarketDetail(marketID, predictionWorldContract);
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
                                <Box
                                    component="img"
                                    src={market.imageHash}
                                    onError={(e) => {
                                        e.target.src = { BACKUP_IMAGE }; // 設置備用圖片的 URL
                                    }}
                                    alt="marketImage"
                                    sx={{ width: "100%", height: "100%" }}
                                />
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
                                    Outcome
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ color: market.hasResolved ? (outcome === BET_TYPE.YES ? "#3FB06B" : "#E84D4D") : "#1A84F2", fontWeight: "bold" }}
                                >
                                    {market.hasResolved ? outcome.toString() : "In progress"}
                                </Typography>
                            </Box>
                            <Box sx={{ backgroundColor: userBetType === BET_TYPE.YES ? "#3FB06B" : "#E84D4D", pl: 2, pr: 3, borderRadius: "4px" }}>
                                <Typography variant="caption" gutterBottom sx={{ color: "rgba(0, 0, 0, 0.65)", fontWeight: "bold" }}>
                                    Your Bet
                                </Typography>
                                <Typography variant="body1" sx={{ color: "#fff", fontWeight: "bold", lineHeight: 1 }}>
                                    {userBetType}: {amount}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ pb: "10px" }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ color: "rgba(0, 0, 0, 0.3)", textAlign: "center", mb: 0 }}>
                                Amount Added
                            </Typography>
                            <Typography variant="body1" sx={{ color: "rgba(0, 0, 0, 0.65)", fontWeight: "bold", textAlign: "center" }}>
                                {`${market.totalYesAmount.toString()} SURE on `}
                                <Typography sx={{ color: "#3FB06B", display: "inline", fontWeight: "bold" }}>Yes</Typography>
                                {` / ${market.totalNoAmount.toString()} SURE on `}
                                <Typography sx={{ color: "#E84D4D", display: "inline", fontWeight: "bold" }}>No</Typography>
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" gutterBottom sx={{ color: "rgba(0, 0, 0, 0.3)", textAlign: "center", mb: 0 }}>
                                Added On / Ending In
                            </Typography>
                            <Typography variant="body1" sx={{ color: "rgba(0, 0, 0, 0.65)", fontWeight: "bold", textAlign: "center" }}>
                                {`${convertBigNumberToDate(market.timestamp)} / ${convertBigNumberToDate(market.endTimestamp)}`}
                            </Typography>
                        </Box>
                    </CardContent>
                </div>
            </Card>
        </Grid>
    );
}
