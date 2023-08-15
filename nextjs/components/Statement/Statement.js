import { EmptyPage } from "@/components/EmptyPage/EmptyPage";
import { Loading } from "@/components/Loading/Loading";
import StatementMarketCard from "@/components/StatementMarketCard";
import { MENU_TYPE } from "@/constants/Constant";
import { LoadingContext } from "@/contexts/LoadingContext";
import { useAccountStore } from "@/store/useAccountStore";
import { useMenuStore } from "@/store/useMenuStore";
import { useStatementStore } from "@/store/useStatementStore";
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
    const { userStatements } = useStatementStore();
    const { account } = useAccountStore();
    const { currentMenu, currentMarketID } = useMenuStore();
    const { isMarketLoading } = useContext(LoadingContext);

    return (
        <>
            {account && currentMenu === MENU_TYPE.STATEMENT && !currentMarketID && (
                <>
                    {isMarketLoading && <Loading />}
                    {!isMarketLoading &&
                        (userStatements && userStatements.length > 0 ? (
                            <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
                                {userStatements.map((market, i) => (
                                    <StatementMarketCard market={market} />
                                ))}
                            </Grid>
                        ) : (
                            <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", width: "100%" }}>
                                    <EmptyPage />
                                </Box>
                            </Grid>
                        ))}
                </>
            )}
        </>
    );
};
