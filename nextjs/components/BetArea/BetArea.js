import { predictionWorld3Address, sureToken3Address } from "@/config";
import { ADD_NO_BET, ADD_YES_BET } from "@/constants/ContractsFunctionName";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { useContext, useState } from "react";

const SELECT_TYPE = {
    YES: "YES",
    NO: "NO"
};

const SelectButton = (props) => {
    const { type, selected, selectedAmount, totalAmount, onClick } = props;
    const buttonName = type;
    const totalAmountText = `${!totalAmount ? `0` : ((selectedAmount * 100) / totalAmount).toFixed(2)}%`;
    const className = `w-full py-2 px-2 ${selected == type ? "bg-green-500 text-white" : "bg-gray-100"} mt-2 cursor-pointer`;

    return (
        <div id={buttonName} className={className} onClick={onClick}>
            <span className="font-bold">{buttonName}</span>
            {totalAmountText}
        </div>
    );
};

export const BetArea = (props) => {
    const { market } = props;
    const { smartAccount, predictionWorldContract, predictionWorldInterface, sureTokenInterface } = useContext(BiconomyAccountContext);
    const [selected, setSelected] = useState(SELECT_TYPE.YES);
    const [input, setInput] = useState("");

    const handleTrade = async () => {
        if (input === "") return;
        try {
            const betFunctionName = selected === SELECT_TYPE.YES ? ADD_YES_BET : ADD_NO_BET;

            try {
                const approveEncodedData = sureTokenInterface.encodeFunctionData("approve", [predictionWorld3Address, input]);
                const addYesBetEncodedData = predictionWorldInterface.encodeFunctionData(betFunctionName, [id, input]);
                const transactions = [
                    {
                        to: sureToken3Address,
                        data: approveEncodedData,
                        gasLimit: 500000
                    },
                    {
                        to: predictionWorld3Address,
                        data: addYesBetEncodedData
                    }
                ];

                const txResponse = await smartAccount.sendTransactionBatch({ transactions });
                console.log("UserOp hash", txResponse.hash);
                const txReceipt = await txResponse.wait();
                console.log("Tx hash", txReceipt.transactionHash);
            } catch (error) {
                console.error(`Error: ${error}`);
            }

            await getMarket(id, predictionWorldContract);
        } catch (error) {
            console.error(`Error trading: ${error}`);
        } finally {
            setInput("");
        }
    };

    return (
        <div className="w-1/3 rounded-lg border border-gray-300 ml-2">
            <div className="flex flex-col items-start p-6">
                <span className="text-lg font-bold m-auto pb-2">Buy</span>
                <hr className="text-black w-full py-2" />
                <span className="text-base">Pick Outcome</span>
                <SelectButton
                    type={SELECT_TYPE.YES}
                    selected={selected}
                    selectedAmount={market?.totalYesAmount}
                    totalAmount={market?.totalAmount}
                    onClick={() => setSelected(SELECT_TYPE.YES)}
                />
                <SelectButton
                    type={SELECT_TYPE.NO}
                    selected={selected}
                    selectedAmount={market?.totalNoAmount}
                    totalAmount={market?.totalAmount}
                    onClick={() => setSelected(SELECT_TYPE.NO)}
                />
                <span className="text-sm mt-5 mb-4">How much?</span>

                {/* TODO: Input可拆出來做 */}
                <div className="w-full border border-gray-300 flex flex-row items-center">
                    <input
                        type="number"
                        name="q"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full py-2 px-2 text-base text-gray-700 border-gray-300 rounded-md focus:outline-none"
                        placeholder="0"
                        autoComplete="off"
                        min={0}
                    />
                    <span className="whitespace-nowrap text-sm font-semibold">SURE</span>
                </div>

                {/* TODO: 下注按鈕，可拆出來做*/}
                <button className="mt-5 rounded-lg py-3 text-center w-full bg-blue-700 text-white" onClick={handleTrade}>
                    Trade
                </button>
            </div>
        </div>
    );
};
