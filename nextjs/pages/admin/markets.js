import AdminMarketCard from "@/components/AdminMarketCard";
import { AdminHeader } from "@/components/Header/AdminHeader";
import { predictionWorldAddress } from "@/config";
import { Button } from "@mui/material";
import { ethers } from "ethers";
import Link from "next/link";
import { useEffect, useState } from "react";
import PredictionWorld from "../../utils/abis/PredictionWorld.json";

export default function Markets() {
    const [markets, setMarkets] = useState([]);

    const getMarkets = async () => {
        try {
            const { ethereum } = window;
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const predictionWorldContract = new ethers.Contract(predictionWorldAddress, PredictionWorld.abi, signer);

            let marketCount = await predictionWorldContract.totalMarkets();
            let markets = [];

            for (let i = 0; i < marketCount; i++) {
                let market = await predictionWorldContract.markets(i);
                markets.push({
                    id: market.id,
                    question: market.info.question,
                    imageHash: market.info.creatorImageHash,
                    totalAmount: market.totalAmount,
                    totalYesAmount: market.totalYesAmount,
                    totalNoAmount: market.totalNoAmount,
                    timestamp: market.info.timestamp,
                    endTimestamp: market.info.endTimestamp
                });
            }
            setMarkets(markets);
        } catch (error) {
            console.error(`Error getting markets, ${error}`);
        }
    };

    useEffect(() => {
        getMarkets();
    }, []);

    return (
        <>
            <div className="flex flex-col justify-center items-center h-full">
                <AdminHeader />
                <Link href="/admin">
                    <Button style={{ backgroundColor: "#1A84F2" }} variant="contained" fullWidth sx={{ mt: 2, mb: 2 }}>
                        Back
                    </Button>
                </Link>

                <main className="w-full flex flex-row flex-wrap py-4 max-w-5xl pb-6">
                    {markets.map((market) => (
                        <div key={market.id} className="w-1/2 pr-2">
                            <AdminMarketCard id={market.id} title={market.question} totalAmount={market.totalAmount} />
                        </div>
                    ))}
                </main>
            </div>
        </>
    );
}
