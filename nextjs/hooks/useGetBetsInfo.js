import { useAccountStore } from "@/store/useAccountStore";
import { useContractStore } from "@/store/useContractStore";
import { useMarketsStore } from "@/store/useMarketsStore";
import { useMenuStore } from "@/store/useMenuStore";
import { useCallback, useEffect } from "react";

const useGetBetsInfo = () => {
    const { setYesInfo, setNoInfo } = useMarketsStore();
    const { account } = useAccountStore();
    const { predictionWorldContract } = useContractStore();
    const { currentMarketID } = useMenuStore();

    const updateBetsInfo = useCallback(
        async (currentMarketID, predictionWorldContract) => {
            try {
                let bets = await predictionWorldContract.getBets(Number(currentMarketID));
                let yesBets = [];
                let noBets = [];
                // yes bets
                bets["0"].forEach((bet) => {
                    yesBets.push({
                        time: new Date(parseInt(bet.timestamp + "000")),
                        amount: bet.amount.toNumber()
                    });
                });
                setYesInfo(yesBets);

                // no bets
                bets["1"].forEach((bet) => {
                    noBets.push({
                        time: new Date(parseInt(bet.timestamp + "000")),
                        amount: bet.amount.toNumber()
                    });
                });
                setNoInfo(noBets);
            } catch (error) {
                console.error(`Error getting bets, ${error}`);
            }
        },
        [currentMarketID, predictionWorldContract]
    );

    useEffect(() => {
        if (currentMarketID && predictionWorldContract) {
            updateBetsInfo(currentMarketID, predictionWorldContract);
        }
    }, [currentMarketID, account, updateBetsInfo]);

    return { updateBetsInfo };
};

export default useGetBetsInfo;
