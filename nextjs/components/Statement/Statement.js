import StatementMarketCard from "@/components/StatementMarketCard";
import { MENU_TYPE } from "@/constants/Constant";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { PageContext } from "@/contexts/PageContext";
import useGetUserStatement from "@/hooks/useGetUserStatement";
import { Box, Grid, Typography } from "@mui/material";
import { useContext } from "react";

/**
 * TODO:
 * 1. 切版 √
 * 2. 優化
 * 3. 用 hook 取資料 √
 * 4. refresh statement
 *
 */
export const Statement = () => {
    const { userTotalBetValue, userStatements } = useGetUserStatement();
    const { account } = useContext(BiconomyAccountContext);
    const { currentMenu, currentMarketID } = useContext(PageContext);

    return (
        <>
            {account && currentMenu === MENU_TYPE.STATEMENT && !currentMarketID && (
                <>
                    <Box
                        sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 0.5, mb: 1, backgroundColor: "#1A84F2", borderRadius: "4px" }}
                    >
                        <Typography variant="subtitle2" sx={{ color: "rgba(0, 0, 0, 0.65)", fontWeight: "bold" }}>
                            Portfoilo Value
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#fff" }}>
                            450
                        </Typography>
                    </Box>
                    <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
                        {userStatements.map((market, i) => (
                            <StatementMarketCard
                                id={market.id}
                                key={i}
                                title={market.title}
                                betType={!!market.yesAmount ? "Yes" : "No"}
                                amount={!!market.yesAmount ? market.yesAmount : market.noAmount}
                                totalYesAmount={market.totalYesAmount}
                                totalNoAmount={market.totalNoAmount}
                                endTimestamp={market.endTimestamp}
                                timestamp={market.timestamp}
                                hasResolved={market.hasResolved}
                                outcome={market.outcome ? "Yes" : "No"}
                            />
                        ))}
                    </Grid>
                </>
            )}
        </>
    );
};
