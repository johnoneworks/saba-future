import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { PageContext } from "@/contexts/PageContext";
import { useCallback, useContext, useEffect, useState } from "react";

const useGetBetsInfo = () => {
    const [yesInfo, setYesInfo] = useState([]);
    const [noInfo, setNoInfo] = useState([]);
    const [yesInfoAmount, setYesInfoAmount] = useState(0);
    const [noInfoAmount, setNoInfoAmount] = useState(0);
    const { account, predictionWorldContract } = useContext(BiconomyAccountContext);
    const { currentMarketID } = useContext(PageContext);

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
                setYesInfoAmount(yesBets.length);
                console.log("yesInfo.length", yesBets);
                // no bets
                bets["1"].forEach((bet) => {
                    noBets.push({
                        time: new Date(parseInt(bet.timestamp + "000")),
                        amount: bet.amount.toNumber()
                    });
                });
                setNoInfo(noBets);
                setNoInfoAmount(noBets.length);
                console.log("totalInfoAmount setTotalInfoAmount: ", yesBets.length + noBets.length);
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

    return { yesInfo, noInfo, yesInfoAmount, noInfoAmount, updateBetsInfo };
};

export default useGetBetsInfo;
