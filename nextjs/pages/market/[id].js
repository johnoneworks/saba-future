import ChartContainer from "@/components/ChartContainer";
import Loading from "@/components/Loading";
import { predictionWorld3Address, sureToken3Address } from "@/config";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import moment from "moment";
import dynamic from "next/dynamic";
import Head from "next/head";
import Img from "next/image";
import { useRouter } from "next/router";
import { Suspense, useCallback, useContext, useEffect, useState } from "react";

//TODO: 放到 constant
const SELECT_TYPE = {
    YES: "YES",
    NO: "NO"
};

const BiconomyNavbar = dynamic(() => import("../../components/BiconomyNavbar").then((res) => res.default), {
    ssr: false
});

const MarketTitle = (props) => {
    const { title, endTimestamp, totalAmount } = props;
    const endTime = endTimestamp ? endTimestamp.toLocaleString() : "N/A";
    const totalSureAmount = `${totalAmount} SURE`;

    return (
        <div className="p-6 rounded-lg flex flex-row justify-start border border-gray-300">
            <div className="flex flex-row">
                <div className="h-w-15 pr-4">
                    <Img src="/placeholder.jpg" alt="placeholder" className="rounded-full" width={55} height={55} />
                </div>
                <div className="flex flex-col justify-start w-1/2 space-y-1">
                    <span className="text-lg font-semibold whitespace-nowrap">{title}</span>
                </div>
            </div>
            <div className="flex flex-row items-center space-x-4 ml-3">
                <div className="flex flex-col justify-start bg-gray-100 p-3">
                    <span className="text-xs font-light text-gray-500 whitespace-nowrap">Market Ends on</span>
                    <span className="text-base font-semibold text-black whitespace-nowrap">{endTime}</span>
                </div>
                <div className="flex flex-col justify-start bg-gray-100 p-3">
                    <span className="text-xs font-light text-gray-500 whitespace-nowrap">Total Volume</span>
                    <span className="text-base font-semibold text-black whitespace-nowrap">{totalSureAmount}</span>
                </div>
            </div>
        </div>
    );
};

const MarketDescription = (props) => {
    const { description, resolverUrl } = props;
    return (
        <div className="w-2/3 flex flex-col">
            <span className="text-base font-semibold py-3">Description</span>
            {description && <span>{description}</span>}
            <span className="text-base my-3 py-2 bg-gray-100 rounded-xl px-3">
                Resolution Source :{" "}
                <a className="text-blue-700" href={resolverUrl}>
                    {resolverUrl}
                </a>
            </span>
        </div>
    );
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

export default function Detail() {
    const router = useRouter();
    const { id } = router.query;
    const { account, smartAccount, predictionWorldContract, predictionWorldInterface, sureTokenInterface } = useContext(BiconomyAccountContext);
    const [loading, setLoading] = useState(false);

    const [market, setMarket] = useState({
        title: "title of market",
        endTimestamp: "1681681545",
        totalAmount: 0,
        totalYesAmount: 0,
        totalNoAmount: 0,
        description: "",
        resolverUrl: null
    });
    const [selected, setSelected] = useState(SELECT_TYPE.YES);
    const [input, setInput] = useState("");

    const getMarket = useCallback(
        async (id, predictionWorldContract) => {
            try {
                const market = await predictionWorldContract.markets(id);
                const date = moment.unix(market.info.endTimestamp / 1000).format("MMMM D, YYYY");
                setMarket({
                    title: market.info.question,
                    endTimestamp: date,
                    totalAmount: market.totalAmount,
                    totalYesAmount: market.totalYesAmount,
                    totalNoAmount: market.totalNoAmount,
                    description: market.info.description,
                    resolverUrl: market.info.resolverUrl
                });
            } catch (error) {
                console.error(`Error getting market detail, ${error}`);
            }
        },
        [id, predictionWorldContract]
    );

    const handleGasless = async () => {
        try {
            setLoading(true);

            let betFunction = null;
            if (input && selected === SELECT_TYPE.YES) {
                betFunction = "addYesBet";
            } else if (input && selected === SELECT_TYPE.NO) {
                betFunction = "addNoBet";
            }

            if (betFunction) {
                let transactions = [];
                try {
                    const approveEncodedData = sureTokenInterface.encodeFunctionData("approve", [predictionWorld3Address, input]);
                    const addYesBetEncodedData = predictionWorldInterface.encodeFunctionData(betFunction, [id, input]);
                    transactions = [
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
            }
        } catch (error) {
            console.error(`Error trading: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectBet = useCallback((type) => {
        setSelected(type);
    }, []);

    useEffect(() => {
        if (id && predictionWorldContract) {
            getMarket(id, predictionWorldContract);
        }
    }, [router.isReady, account, getMarket]);

    return (
        <div className="flex flex-col justify-center items-center h-full">
            <Loading loading={loading}></Loading>

            {/* TODO: 返回功能 */}
            <Head>
                <title>Prediction World</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Suspense fallback={<div>Loading...</div>}>
                <BiconomyNavbar />
            </Suspense>

            <div className="w-full flex flex-col sm:flex-row py-4 max-w-5xl">
                <div className="w-full flex flex-col pt-1">
                    {/* market title */}
                    <MarketTitle title={market?.title} endTimestamp={market?.endTimestamp} totalAmount={market?.totalAmount} />
                    {/* market container */}
                    <div className="flex flex-col space-y-3">
                        <div className="w-full flex flex-row mt-5">
                            {/* TODO: Market 的詳細資料 */}
                            <div className="w-2/3 border rounded-lg p-1 pb-4 border-gray-300 mr-2">
                                <ChartContainer questionId={id} />
                            </div>
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
                                        onClick={() => handleSelectBet(SELECT_TYPE.YES)}
                                    />
                                    <SelectButton
                                        type={SELECT_TYPE.NO}
                                        selected={selected}
                                        selectedAmount={market?.totalNoAmount}
                                        totalAmount={market?.totalAmount}
                                        onClick={() => handleSelectBet(SELECT_TYPE.NO)}
                                    />
                                    <span className="text-sm mt-5 mb-4">How much?</span>

                                    {/* TODO: Input可拆出來做 */}
                                    <div className="w-full border border-gray-300 flex flex-row items-center">
                                        <input
                                            type="search"
                                            name="q"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            className="w-full py-2 px-2 text-base text-gray-700 border-gray-300 rounded-md focus:outline-none"
                                            placeholder="0"
                                            autoComplete="off"
                                        />
                                        <span className="whitespace-nowrap text-sm font-semibold">SURE</span>
                                    </div>

                                    {/* TODO: 下注按鈕，可拆出來做*/}
                                    <button className="mt-5 rounded-lg py-3 text-center w-full bg-blue-700 text-white" onClick={handleGasless}>
                                        Trade
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Market Description */}
                    <MarketDescription description={market?.description} resolverUrl={market?.resolverUrl} />
                </div>
            </div>
        </div>
    );
}
