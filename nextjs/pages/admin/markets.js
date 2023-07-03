import AdminMarketCard from "@/components/AdminMarketCard";
import { AdminHeader } from "@/components/Header/AdminHeader";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { Button } from "@mui/material";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function Markets() {
    const [markets, setMarkets] = useState([]);
    const { predictionWorldContract } = useContext(BiconomyAccountContext);

    const getMarkets = async () => {
        try {
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
