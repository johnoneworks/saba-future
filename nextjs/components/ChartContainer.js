import { ethers } from "ethers";

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
        } catch(error) {
            console.log(`Error getting bets, ${error}`);
        }
    }

    return (
        <>
            {questionId}
            <div id="myDiv"></div>
        </>
    );
}