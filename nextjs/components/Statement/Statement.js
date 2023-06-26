import StatementMarketCard from "@/components/StatementMarketCard";
import { useGetUserStatement } from "@/hooks/useGetUserStatement";
import { Grid } from "@mui/material";
import styles from "../../styles/Home.module.css";
import MarketLoading from "../LoadingPage/MarketLoading";

/**
 * TODO:
 * 1. 切版
 * 2. 優化
 * 3. 用 hook 取資料 √
 * 4. refresh statement
 *
 */
export const Statement = () => {
    const { userTotalBetValue, userStatements, getStatement } = useGetUserStatement();

    return (
        <div className={styles.container}>
            <div className="w-full flex flex-col pt-1">
                <MarketLoading />
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
            </div>
        </div>
    );
};
