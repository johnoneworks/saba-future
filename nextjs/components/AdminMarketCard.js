import Img from "next/image";
import { ethers } from "ethers";

import { predictionWorld3Address } from "@/config";
import PredictionWorld from "../utils/abis/PredictionWorld3.json"

export default function PortfolioMarketCard({
    id,
    title,
    totalAmount
}) {

    let predictionWorldContract;
    try {
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        predictionWorldContract = new ethers.Contract(
            predictionWorld3Address,
            PredictionWorld.abi,
            signer
        );
    } catch (error) {
        console.log(`Error getting markets, ${error}`);
    }

    const onYes = async () => {
        await predictionWorldContract.distributeWinningAmount(id, true);
    }
    const onNo = async () => {
        await predictionWorldContract.distributeWinningAmount(id, true);
    }

    return (
        <div className="w-full overflow-hidden my-2">
            <div className="flex flex-col border border-gray-300 rounded-lg p-5 hover:border-blue-700 cursor-pointer">
                <div className="flex flex-row space-x-5 pb-4">
                    <div className="h-w-15">
                        <Img
                            src="/placeholder.jpg"
                            alt="placeholder"
                            className="rounded-full"
                            width={55}
                            height={55}
                        />
                    </div>
                    <span className="text-lg font-semibold">{title}</span>
                </div>
                <div className="flex flex-row flex-nowrap justify-between items-center">
                    <div className="flex flex-col space-y-1">
                        <span className="text-xs text-gray-500 font-light">
                            Total Liquidity
                        </span>
                        <span className="text-base">
                            {`${totalAmount} SURE`}
                        </span>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <span className="text-xs text-gray-500 font-light">Ending In</span>
                        <span className="text-base">12 Days(placeholder)</span>
                    </div>
                    <div className="flex flex-row space-x-2 items-end">
                    <button
                        className="py-1 px-2 rounded-lg bg-blue-700 text-white"
                        onClick={onYes}
                    >
                        Resolve YES
                    </button>
                    <button
                        className="py-1 px-2 rounded-lg bg-blue-700 text-white"
                        onClick={onNo}
                    >
                        Resolve No
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
}