import { ethers } from "ethers";
import Link from "next/link";
import { useCallback, useContext, useEffect, useState } from "react";

import { Header } from "@/components/Header/Header";
import { predictionWorld3Address } from "@/config";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";

export default function Admin() {
    const [submitButtonText, setSubmitButtonText] = useState("Create Market");
    const [balance, setBalance] = useState(0);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [resolverUrl, setResolverUrl] = useState("");
    const [timestamp, setTimestamp] = useState(Date());
    const { provider, sureTokenContract, account, smartAccount, predictionWorldInterface } = useContext(BiconomyAccountContext);

    const getBalance = useCallback(async () => {
        try {
            if (!account) {
                return;
            }
            let balance = await sureTokenContract.balanceOf(account);
            setBalance(ethers.utils.commify(balance));
        } catch (error) {
            console.error(`Error getting balance, ${error}`);
        }
    }, [account]);

    const handleSubmit = async () => {
        try {
            setSubmitButtonText("Creating");
            await createMarketWithGasless();
            alert("Success!");
        } catch (error) {
            console.error(`Error creating market`);
            console.error(error);
            alert("Error!!");
        } finally {
            setSubmitButtonText("Create Market");
        }
    };

    const createMarketWithGasless = async () => {
        let transactions = [];
        const transactionData = predictionWorldInterface.encodeFunctionData("createMarket", [title, "", description, resolverUrl, timestamp]);

        transactions = [
            {
                to: predictionWorld3Address,
                data: transactionData
            }
        ];

        const txResponse = await smartAccount.sendTransactionBatch({ transactions });
        console.log("UserOp hash", txResponse.hash);
        const txReceipt = await txResponse.wait();
        console.log("Tx hash", txReceipt.transactionHash);
        const txReceipt2 = await provider.getTransactionReceipt(txReceipt.transactionHash);
    };

    useEffect(() => {
        getBalance();
    }, [account, getBalance]);

    return (
        <>
            <div className="flex flex-col justify-center items-center h-full p-5">
                <Header />
                <main className="w-full flex flex-col py-4 max-w-5xl pb-6">
                    <Link href="/admin/markets" className="mt-5 rounded-lg py-3 text-center w-full bg-blue-700 text-white font-bold mb-5">
                        See All Markets
                    </Link>
                    You have: {balance} SURE tokens
                    <div className="w-full flex flex-col pt-1 border border-gray-300 p-5 rounded-lg ">
                        <span className="text-lg font-semibold mt-4">Add New Market</span>
                        <span className="text-lg font mt-6 mb-1">Market Title</span>
                        <input
                            type="input"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full py-3 px-3 text-base text-gray-700 bg-gray-100 rounded-md focus:outline-none"
                            placeholder="Title"
                            autoComplete="off"
                        />
                        <span className="text-lg font mt-6 mb-1">Market Description</span>
                        <textarea
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full py-3 px-3 text-base text-gray-700 bg-gray-100 rounded-md focus:outline-none"
                            placeholder="Description"
                            autoComplete="off"
                        ></textarea>
                        <span className="text-lg font mt-6 mb-1">Resolve URL</span>
                        <input
                            type="input"
                            name="resolverUrl"
                            value={resolverUrl}
                            onChange={(e) => setResolverUrl(e.target.value)}
                            className="w-full py-3 px-3 text-base text-gray-700 bg-gray-100 rounded-md focus:outline-none"
                            placeholder="URL"
                            autoComplete="off"
                        />
                        <span className="text-lg font mt-6 mb-1">End Date</span>
                        <input
                            type="date"
                            name="timestamp"
                            // value={timestamp}
                            onChange={(e) => {
                                setTimestamp(e.target.valueAsDate?.getTime());
                            }}
                            className="w-full py-3 px-3 text-base text-gray-700 bg-gray-100 rounded-md focus:outline-none"
                            autoComplete="off"
                        />
                        <button
                            className="mt-5 rounded-lg py-3 text-center w-full bg-green-500 text-white font-bold"
                            onClick={() => {
                                handleSubmit();
                            }}
                        >
                            {submitButtonText}
                        </button>
                    </div>
                </main>
            </div>
        </>
    );
}
