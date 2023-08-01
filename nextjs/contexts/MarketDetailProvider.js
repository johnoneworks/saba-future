import { BACKUP_IMAGE } from "@/constants/Constant";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { PageContext } from "@/contexts/PageContext";
import moment from "moment";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export const MarketDetailContext = createContext(null);

const initialState = {
    id: null,
    title: "title of market",
    imageHash: "",
    endTimestamp: "1681681545",
    totalAmount: 0,
    totalYesAmount: 0,
    totalNoAmount: 0,
    description: "",
    resolverUrl: null,
    isClose: undefined
};

export const MarketDetailProvider = ({ children }) => {
    const { account, predictionWorldContract } = useContext(BiconomyAccountContext);
    const [marketDetail, setMarketDetail] = useState(initialState);
    const { currentMarketID } = useContext(PageContext);
    const { setIsPageLoading } = useContext(LoadingContext);

    const updateMarketDetail = useCallback(
        async (currentMarketID, predictionWorldContract) => {
            try {
                setIsPageLoading(true);
                const market = await predictionWorldContract.markets(currentMarketID);
                const date = moment.unix(market.info.endTimestamp / 1000);
                const dateString = date.format("MMMM D, YYYY HH:mm");
                setMarketDetail({
                    id: currentMarketID,
                    title: market.info.question,
                    imageHash: market.info.creatorImageHash ? market.info.creatorImageHash : BACKUP_IMAGE,
                    endTimestamp: dateString,
                    endDate: date,
                    totalAmount: market.totalAmount,
                    totalYesAmount: market.totalYesAmount,
                    totalNoAmount: market.totalNoAmount,
                    description: market.info.description,
                    resolverUrl: market.info.resolverUrl,
                    isClose: market.marketClosed,
                    isTest: market.info.isTest,
                    isSuspended: market.isSuspended
                });
                setIsPageLoading(false);
            } catch (error) {
                console.error(`Error getting market detail`);
                console.error(error);
            }
        },
        [currentMarketID, predictionWorldContract]
    );

    useEffect(() => {
        if (currentMarketID && predictionWorldContract) {
            updateMarketDetail(currentMarketID, predictionWorldContract);
        }
    }, [currentMarketID, account, updateMarketDetail]);

    return <MarketDetailContext.Provider value={{ marketDetail, updateMarketDetail }}>{children}</MarketDetailContext.Provider>;
};
