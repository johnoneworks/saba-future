import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import StatementMarketCard from "@/components/StatementMarketCard";
import { MENU_TYPE } from "@/constants/Constant";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { PageContext } from "@/contexts/PageContext";
import { UserInfoContext } from "@/contexts/UserInfoContext";
import { Grid } from "@mui/material";
import { useContext } from "react";

/**
 * TODO:
 * 1. 切版 √
 * 2. 優化
 * 3. 用 hook 取資料 √
 * 4. refresh statement √
 *
 */
export const Statement = () => {
    const { userTotalBetValue, userStatements } = useContext(UserInfoContext);
    const { account } = useContext(BiconomyAccountContext);
    const { isMarketLoading } = useContext(LoadingContext);
    const { currentMenu, currentMarketID } = useContext(PageContext);

    return (
        <>
            {account && currentMenu === MENU_TYPE.STATEMENT && !currentMarketID && (
                <>
                    {isMarketLoading && <LoadingSkeleton amount={3} />}
                    {!isMarketLoading && (
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
            )}
        </>
    );
};
