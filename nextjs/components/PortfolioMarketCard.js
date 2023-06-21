import { Avatar, Box, Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { convertBigNumberToDate } from "../utils/ConvertDate";

export default function PortfolioMarketCard({ id, title, betType, amount, totalYesAmount, totalNoAmount, timestamp, endTimestamp, hasResolved, outcome }) {
    let bgColor = "";
    if (hasResolved) {
        bgColor = outcome === betType ? "success.light" : "error.light"; // TODO: add color
    }

    return (
        <Grid item xs={12} sm={6} md={4} key={id}>
            <Card sx={{ boxShadow: 3 }}>
                <Link href={`/market/${id}`} passHref>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="recipe" variant="rounded" sx={{ width: 64, height: 64 }}>
                                <Image src="/placeholder.jpg" alt="placeholder" className="rounded-full" width={64} height={64} />
                            </Avatar>
                        }
                        title={title}
                        titleTypographyProps={{ variant: "h5", fontWeight: "bold" }}
                        sx={{ pb: 0 }}
                    />
                    <CardContent sx={{ display: "flex", flexDirection: "column", cursor: "pointer", pt: 0 }}>
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
                                <Typography variant="body1" sx={{ color: "#1A84F2", fontWeight: "bold" }}>
                                    {hasResolved ? outcome.toString() : "In progress"}
                                </Typography>
                            </Box>
                            <Box sx={{ bgcolor: "#3FB06B", pl: "8px", pr: "6px", borderRadius: "4px" }}>
                                <Typography variant="subtitle2" gutterBottom sx={{ color: "rgba(0, 0, 0, 0.65)", mb: "5px", lineHeight: 1, pt: "5px" }}>
                                    Your Bet
                                </Typography>
                                <Typography variant="body1" sx={{ color: "#fff", fontWeight: "bold", lineHeight: 1 }}>
                                    {betType}: {amount}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ pb: "10px" }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ color: "rgba(0, 0, 0, 0.3)", textAlign: "center", mb: 0 }}>
                                Amount Added
                            </Typography>
                            <Typography variant="body1" sx={{ color: "rgba(0, 0, 0, 0.65)", fontWeight: "bold", textAlign: "center" }}>
                                {`${totalYesAmount.toString()} SURE on `}
                                <Typography sx={{ color: "#3FB06B", display: "inline", fontWeight: "bold" }}>Yes</Typography>
                                {` / ${totalNoAmount.toString()} SURE on `}
                                <Typography sx={{ color: "#E84D4D", display: "inline", fontWeight: "bold" }}>No</Typography>
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" gutterBottom sx={{ color: "rgba(0, 0, 0, 0.3)", textAlign: "center", mb: 0 }}>
                                Added On / Ending In
                            </Typography>
                            <Typography variant="body1" sx={{ color: "rgba(0, 0, 0, 0.65)", fontWeight: "bold", textAlign: "center" }}>
                                {`${convertBigNumberToDate(timestamp)} / ${convertBigNumberToDate(endTimestamp)}`}
                            </Typography>
                        </Box>
                    </CardContent>
                </Link>
            </Card>
        </Grid>
    );
}
