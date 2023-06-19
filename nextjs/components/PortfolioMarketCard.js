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
        <Grid item xs={12} sm={6} md={6} key={id}>
            <Card>
                <Link href={`/market/${id}`} passHref>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="recipe">
                                <Image src="/placeholder.jpg" alt="placeholder" className="rounded-full" width={55} height={55} />
                            </Avatar>
                        }
                        title={title}
                    />
                    <CardContent sx={{ display: "flex", flexDirection: "column", cursor: "pointer" }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                Your Bet
                            </Typography>
                            <Typography variant="button" sx={{ backgroundColor: "success.main", color: "white", px: 3 }}>
                                <strong>{betType}:</strong> {amount}
                            </Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={12}>
                                    <Typography variant="caption" color="text.secondary">
                                        Outcome
                                    </Typography>
                                    <Typography variant="body1">{hasResolved ? outcome.toString() : "In progress"}</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Added On
                                    </Typography>
                                    <Typography variant="body1">{convertBigNumberToDate(timestamp)}</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Ending In
                                    </Typography>
                                    <Typography variant="body1">{convertBigNumberToDate(endTimestamp)}</Typography>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <Grid item xs={12} md={12}>
                                        <Typography variant="caption" color="text.secondary">
                                            Amount Added
                                        </Typography>
                                    </Grid>
                                    <Grid container xs={12} md={12}>
                                        <Grid item xs={6} md={6}>
                                            {totalYesAmount.toString()} SURE on Yes
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            {totalNoAmount.toString()} SURE on No
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Link>
            </Card>
        </Grid>
    );
}
