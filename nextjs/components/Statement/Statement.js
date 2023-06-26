import StatementMarketCard from "@/components/StatementMarketCard";
import { MENU_TYPE } from "@/constants/Constant";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { PageContext } from "@/contexts/PageContext";
import useGetUserStatement from "@/hooks/useGetUserStatement";
import { Grid } from "@mui/material";
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
            )}
        </>
    );
};
