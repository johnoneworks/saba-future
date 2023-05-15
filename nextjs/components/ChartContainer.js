import { ethers } from "ethers";
import { useState, useEffect, useContext } from "react";
//import Plotly from 'plotly.js-dist-min';

import { predictionWorld3Address } from "@/config";
import PredictionWorld from "../utils/abis/PredictionWorld3.json";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";

export default function ChartContainer({ questionId }) {
    const [yesInfo, setYesInfo] = useState([]);
    const [noInfo, setNoInfo] = useState([]);
    const { account, provider } = useContext(BiconomyAccountContext);

    const getBets = async () => {
        try {
            const { ethereum } = window;
            //const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const predictionWorldContract = new ethers.Contract(
                predictionWorld3Address,
                PredictionWorld.abi,
                signer
            );
            //console.log(typeof questionId);
            let bets = await predictionWorldContract.getBets(Number(questionId));
            //console.log("bets");
            //console.log(bets);
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

        } catch(error) {
            console.log(`Error getting bets, ${error}`);
        }
    }

    useEffect(() => {
        getBets();
    });

    return (
        <>
            <div>
                Yes Info
                <hr />
                <table>
                    <tr>
                        <th>Time</th>
                        <th>Amount</th>
                    </tr>
                    {yesInfo.map(bet => {
                        return (
                            <tr>
                                <td>{bet.time.toLocaleString()}</td>
                                <td>{bet.amount}</td>
                            </tr>
                        );
                    })}
                </table>
                No Info
                <hr />
                <table>
                    <tr>
                        <th>Time</th>
                        <th>Amount</th>
                    </tr>
                    {noInfo.map(bet => {
                        return (
                            <tr>
                                <td>{bet.time.toLocaleString()}</td>
                                <td>{bet.amount}</td>
                            </tr>
                        );
                    })}
                </table>
            </div>
        </>
    );
}