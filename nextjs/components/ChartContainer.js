import { ethers } from "ethers";
import { useEffect } from "react";
import Plotly from 'plotly.js-dist-min';

import { predictionWorld3Address } from "@/config";
import PredictionWorld from "../utils/abis/PredictionWorld3.json";

export default function ChartContainer({ questionId }) {
    const getBets = async () => {
        try {
            const { ethereum } = window;
            const provider = new ethers.providers.Web3Provider(ethereum);
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
            let yesBets = {
                time: [],
                amount: [],
            };
            let noBets = {
                time: [],
                amount: [],
            };
            // yes bets
            bets["0"].forEach((bet) => {
                yesBets.time.push(new Date(parseInt(bet.timestamp + "000")));
                let currentSum = yesBets.amount.reduce((a, b) => a + b, 0);
                yesBets.amount.push(currentSum + bet.amount.toNumber());
            });
            // no bets
            bets["1"].forEach((bet) => {
                noBets.time.push(new Date(parseInt(bet.timestamp + "000")));
                let currentSum = noBets.amount.reduce((a, b) => a + b, 0);
                noBets.amount.push(currentSum + bet.amount.toNumber());
            });

            const yesGraph = {
                x: [...yesBets.time],
                y: [...yesBets.amount],
                mode: "lines+markers",
                name: "Yes",
            };

            const noGraph = {
                x: [...noBets.time],
                y: [...noBets.amount],
                mode: "lines+markers",
                name: "No",
            };

            const chartData = [yesGraph, noGraph];
            const layout = {
                title: "Yes / No Graph",
            };

            Plotly.newPlot("myDiv", chartData, layout, { displayModeBar: false });
        } catch(error) {
            console.log(`Error getting bets, ${error}`);
        }
    }

    useEffect(() => {
        getBets();
    });

    return (
        <>
            <div id="myDiv"></div>
        </>
    );
}