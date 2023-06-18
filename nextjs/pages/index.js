import Filter from "@/components/Filter";
import { Header } from "@/components/Header/Header";
import MarketCard from "@/components/MarketCard";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

const MARKET_TYPE = {
    OPEN: "Open",
    CLOSE: "Close"
};

const ShowMarkets = (props) => {
    const { markeType, markets, account } = props;
    const isClose = markeType !== MARKET_TYPE.OPEN;

    return (
        <>
            {markets.reduce((accumulator, market) => {
                const isAvailable = isClose ? market.marketClosed : !market.marketClosed;
                if (isAvailable) {
                    accumulator.push(
                        <div key={market.id} className={styles.marketCard}>
                            <MarketCard
                                id={market.id}
                                key={market.id}
                                title={market.question}
                                totalAmount={market.totalAmount}
                                totalYesAmount={market.totalYesAmount}
                                totalNoAmount={market.totalNoAmount}
                                outcome={market.outcome}
                                yesBets={market.yesBets}
                                noBets={market.noBets}
                                currentUser={account}
                                isClosed={isClose}
                            />
                        </div>
                    );
                }
                return accumulator;
            }, [])}
        </>
    );
};

export default function Home() {
    const [balance, setBalance] = useState(0);
    const { account, smartAccount, sureTokenContract, predictionWorldContract } = useContext(BiconomyAccountContext);
    const [markets, setMarkets] = useState([]);

    const getBalance = async () => {
        try {
            if (!smartAccount.address) {
                return;
            }
            let balance = await sureTokenContract.balanceOf(smartAccount.address);
            setBalance(ethers.utils.commify(balance));
        } catch (error) {
            console.error(`Error getting balance, ${error}`);
        }
    };

    const getMarkets = async () => {
        try {
            if (!smartAccount.address) {
                return;
            }
            let marketCount = await predictionWorldContract.totalMarkets();
            let markets = [];
            for (let i = 0; i < marketCount; i++) {
                let market = await predictionWorldContract.markets(i);
                console.log(i);
                console.log(`market.id: ${market.info.question}`);

                let mt = {
                    id: market.id,
                    question: market.info.question,
                    imageHash: market.info.creatorImageHash,
                    totalAmount: market.totalAmount,
                    totalYesAmount: market.totalYesAmount,
                    totalNoAmount: market.totalNoAmount,
                    marketClosed: market.marketClosed,
                    outcome: market.outcome
                };

                if (market.marketClosed) {
                    const bets = await getBets(market.id);
                    mt = { ...mt, ...bets };
                }

                markets.push(mt);
            }
            setMarkets(markets);
        } catch (error) {
            console.error(`Error getting market: ${error}`);
        }
    };

    const getBets = async (marketId) => {
        let bets = await predictionWorldContract.getBets(Number(marketId));
        let yesBets = [];
        let noBets = [];
        // yes bets
        bets["0"].forEach((bet) => {
            yesBets.push({
                time: new Date(parseInt(bet.timestamp + "000")),
                amount: bet.amount.toNumber(),
                user: bet.user
            });
        });
        // no bets
        bets["1"].forEach((bet) => {
            noBets.push({
                time: new Date(parseInt(bet.timestamp + "000")),
                amount: bet.amount.toNumber(),
                user: bet.user
            });
        });
        return {
            yesBets,
            noBets
        };
    };

    const refreshMarkets = () => {
        // TODO
    };

    useEffect(() => {
        getBalance();
        getMarkets();
    }, [account]);

    return (
        <div className={styles.container}>
            {/* Header NavBar */}
            <Header />
            <main className="w-full flex flex-col sm:flex-row flex-wrap sm:flex-nowrap py-4 flex-grow max-w-5xl">
                <div className="w-full flex flex-col flex-grow pt-1">
                    <div className="relative text-gray-500 focus-within:text-gray-400 w-full">
                        <span className="absolute inset-y-0 left-0 flex items-center px-3">
                            <svg
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                className="w-5 h-5"
                            >
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </span>
                        <input
                            type="search"
                            name="q"
                            className="w-full py-3 px-3 text-base text-gray-700 bg-gray-100 rounded-md pl-10 focus:outline-none"
                            placeholder="Search markets..."
                            autoComplete="off"
                        />
                    </div>
                    <div className="flex flex-row space-x-2 md:space-x-5 items-center flex-wrap mt-4">
                        <Filter list={["All", "Crypto", "Football", "Covid 19", "OneSeal"]} activeItem="All" category="Category" onChange={() => {}} />
                        <Filter list={["Volume", "Newest", "Expiring"]} activeItem="Volume" category="Sort By" onChange={() => {}} />
                    </div>
                    You have: {balance} SURE tokens
                    <br />
                    <span className="font-bold my-3 text-lg">Market</span>
                    <div>Open Markets</div>
                    <div className={styles.marketCardContainer}>
                        <ShowMarkets markeType={MARKET_TYPE.OPEN} markets={markets} account={account} />
                    </div>
                    <div>Closed Markets</div>
                    <div className="flex flex-wrap overflow-hidden sm:-mx-1 md:-mx-2">
                        <ShowMarkets markeType={MARKET_TYPE.CLOSE} markets={markets} account={account} />
                    </div>
                </div>
            </main>
        </div>
    );
}
