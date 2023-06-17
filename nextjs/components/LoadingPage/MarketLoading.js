import { LoadingContext } from "@/contexts/LoadingContext";
import { useContext } from "react";
import styles from "./MarketLoading.module.css";

export default function MarketLoading() {
    const { isMarketLoading } = useContext(LoadingContext);
    return (
        <>
            {isMarketLoading && (
                <div className={styles.marketLoading}>
                    <div
                        className="inline-block h-16 w-16 animate-spin rounded-full border-8 border-solid border-current border-r-transparent align-[-0.125em] text-purple-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status"
                    ></div>
                </div>
            )}
        </>
    );
}
