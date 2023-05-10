import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";

import styles from "../styles/Home.module.css";
import Navbar from "@/components/Navbar";
import { predictionWorld3Address } from "@/config";
import PredictionWorld from "../utils/abis/PredictionWorld3.json";
import PortfolioMarketCard from "@/components/PortfolioMarketCard";
import { AccountContext } from '../contexts/AccountContext';


export default function Portfolio() {
  const [account] = useContext(AccountContext);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [personalBetInfo, setPersonalBetInfo] = useState([]);


  const getMarkets = async () => {
    try {
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const predictionWorldContract = new ethers.Contract(
        predictionWorld3Address,
        PredictionWorld.abi,
        signer
      );

      const accounts = await ethereum.request({ method: "eth_accounts" });
      const account = accounts[0];

      let marketCount = await predictionWorldContract.totalMarkets();
      let markets = [];
      for (let i = 0; i < marketCount; i++) {
        let market = await predictionWorldContract.markets(i);
        markets.push({
          id: market.id,
          title: market.info.question,
          imageHash: "", // temp holder
          totalAmount: market.totalAmount,
          totalYesAmount: market.totalYesAmount,
          totalNoAmount: market.totalNoAmount,
          hasResolved: market.marketClosed,
          endTimestamp: market.info.endTimestamp,
          timestamp: market.info.timestamp,
          outcome: market.outcome,
        });
      }
      console.log(`markets size: ${markets.length}`);

      let personalizedBetInfo = [];
      let totalBetAmount = 0;
      for (let i = 0; i < markets.length; i++) {
        let marketBets = await predictionWorldContract.getBets(i);
        marketBets["0"].forEach((bet) => {
          if (bet.user.toLowerCase() == account.toLowerCase()) {
            personalizedBetInfo.push({
              id: i.toString(),
              yesAmount: bet.amount.toString(),
              timestamp: bet.timestamp.toString(),
            });
            totalBetAmount += parseInt(bet.amount);
          }
        });
        marketBets["1"].forEach((bet) => {
          if (bet.user.toLowerCase() == account.toLowerCase()) {
            personalizedBetInfo.push({
              id: i.toString(),
              noAmount: bet.amount.toString(),
              timestamp: bet.timestamp.toString(),
            });
            totalBetAmount += parseInt(bet.amount);
          }
        });
      }
      setPortfolioValue(totalBetAmount);
      for (let i = 0; i < personalizedBetInfo.length; i++) {
        let market = markets.find((market) => market.id == personalizedBetInfo[i].id);
        personalizedBetInfo[i].title = market?.title;
        personalizedBetInfo[i].imageHash = market?.imageHash;
        personalizedBetInfo[i].totalAmount = market?.totalAmount;
        personalizedBetInfo[i].totalYesAmount = market?.totalYesAmount;
        personalizedBetInfo[i].totalNoAmount = market?.totalNoAmount;
        personalizedBetInfo[i].hasResolved = market?.hasResolved;
        personalizedBetInfo[i].endTimestamp = market?.endTimestamp;
        personalizedBetInfo[i].timestamp = market?.timestamp;
        personalizedBetInfo[i].outcome = market?.outcome;
      }
      setPersonalBetInfo(personalizedBetInfo);
    } catch (error) {
      console.log(`Error getting markets, ${error}`);
    }
  }

  useEffect(() => {
    getMarkets();
  }, [account]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Prediction World</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="w-full flex flex-col sm:flex-row flex-wrap sm:flex-nowrap py-4 flex-grow max-w-5xl">
        <div className="w-full flex flex-col pt-1">
          <div className="p-10 bg-blue-700 rounded-lg flex flex-row justify-evenly">
            <div className="flex flex-col items-center">
              <h1 className="text-white opacity-50 text-lg">Portfolio Value</h1>
              <h1 className="text-white text-4xl font-bold">
                {portfolioValue}{" SURE"}
              </h1>
            </div>
          </div>
          <span className="font-bold my-3 text-lg">Your Market Positions</span>
          {personalBetInfo.map((market, i) => (
            <PortfolioMarketCard
              id={market.id}
              key={i}
              title={market.title}
              betType={!!market.yesAmount?"Yes":"No"}
              amount={!!market.yesAmount?market.yesAmount:market.noAmount}
              totalYesAmount={market.totalYesAmount}
              totalNoAmount={market.totalNoAmount}
              endTimestamp={market.endTimestamp}
              timestamp={market.timestamp}
              hasResolved={market.hasResolved}
              outcome={market.outcome?"Yes":"No"}
            />
          ))}
        </div>
      </main>
    </div>
  );
}