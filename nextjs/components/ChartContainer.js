import { useState, useEffect, useCallback, useContext } from "react";
//import Plotly from 'plotly.js-dist-min';

import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";

export default function ChartContainer({ questionId }) {
    const [yesInfo, setYesInfo] = useState([]);
    const [noInfo, setNoInfo] = useState([]);
    const { account, predictionWorldContract } = useContext(BiconomyAccountContext);

    const getBets = useCallback(async (questionId, predictionWorldContract) => {
        try {
            let bets = await predictionWorldContract.getBets(Number(questionId));
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
    }, [questionId, predictionWorldContract]);

    useEffect(() => {
        if (questionId && predictionWorldContract) {
            getBets(questionId, predictionWorldContract);
        }
    }, [questionId, account, getBets]);

    return (
        <>
            <div>
                Yes Info
                <hr />
                <table>
                    <tbody>
                        <tr>
                            <th>Time</th>
                            <th>Amount</th>
                        </tr>
                        {yesInfo.map((bet, i) => {
                            return (
                                <tr key={i}>
                                    <td>{bet.time.toLocaleString()}</td>
                                    <td>{bet.amount}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                No Info
                <hr />
                <table>
                    <tbody>
                        <tr>
                            <th>Time</th>
                            <th>Amount</th>
                        </tr>
                        {noInfo.map((bet, i) => {
                            return (
                                <tr key={i}>
                                    <td>{bet.time.toLocaleString()}</td>
                                    <td>{bet.amount}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
}