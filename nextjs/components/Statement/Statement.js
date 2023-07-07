import { EmptyPage } from "@/components/EmptyPage/EmptyPage";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import StatementMarketCard from "@/components/StatementMarketCard";
import { MENU_TYPE } from "@/constants/Constant";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { PageContext } from "@/contexts/PageContext";
import { UserInfoContext } from "@/contexts/UserInfoContext";
import { Box, Grid } from "@mui/material";
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
                                <StatementMarketCard market={market} />
                            ))}
                        </Grid>
                    )}
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                        <EmptyPage />
                    </Box>
                </>
            )}
        </>
    );
};
