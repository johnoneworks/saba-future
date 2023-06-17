import { ChainId } from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";
import SocialLogin from "@biconomy/web3-auth";
import "@biconomy/web3-auth/dist/src/style.css";
import { ethers } from "ethers";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect } from "react";

import { predictionWorld3Address, sureToken3Address } from "@/config";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import PredictionWorld from "@/utils/abis/PredictionWorld3.json";
import SURE from "@/utils/abis/SureToken3.json";

export default function BiconomyNavbar() {
    const router = useRouter();
    const {
        account,
        setAccount,
        socialLoginSDK,
        setSocialLoginSDK,
        setProvider,
        setSmartAccount,
        setSureTokenContract,
        setSureTokenInterface,
        setPredictionWorldContract,
        setPredictionWorldInterface,
        email,
        setEmail
    } = useContext(BiconomyAccountContext);

    const connectWallet = useCallback(async () => {
        console.log("connectWallet()");
        if (typeof window === "undefined") return;
        console.log(`socialLoginSDK: ${socialLoginSDK}`);

        let sdk = null;
        if (window.socialLoginSDK) {
            sdk = window.socialLoginSDK;
        } else {
            sdk = new SocialLogin();
        }

        if (!sdk.isInit) {
            const signature = await sdk.whitelistUrl("https://saba-future.vercel.app");
            await sdk.init({
                chainId: ethers.utils.hexValue(ChainId.POLYGON_MUMBAI),
                whitelistUrls: {
                    "https://saba-future.vercel.app": signature
                }
            });
        }

        if (sdk.web3auth.status !== "connected") {
            await sdk.showWallet();
        } else {
            const web3Provider = new ethers.providers.Web3Provider(sdk.provider);
            const accounts = await web3Provider.listAccounts();
            console.log(`account:${accounts[0]}`);

            const smartAccountOptions = {
                activeNetworkId: ChainId.POLYGON_MUMBAI,
                supportedNetworksIds: [ChainId.POLYGON_MUMBAI],
                networkConfig: [
                    {
                        chainId: ChainId.POLYGON_MUMBAI,
                        dappAPIKey: "WFa23cEs2.8010afd7-00e3-48a5-9f14-183faf9a8361", // TODO: should use .env
                        providerUrl: "https://polygon-mumbai.g.alchemy.com/v2/GDTl7qsRqT4CbILRcYxCOC1DF2-jpNuF" // TODO: should use .env
                    }
                ]
            };

            let smartAccount = new SmartAccount(web3Provider, smartAccountOptions);
            smartAccount = await smartAccount.init();

            const signer = web3Provider.getSigner();
            const sureTokenContract = new ethers.Contract(sureToken3Address, SURE.abi, signer);
            const sureTokenInterface = new ethers.utils.Interface(SURE.abi);

            const predictionWorldContract = new ethers.Contract(predictionWorld3Address, PredictionWorld.abi, signer);
            const predictionWorldInterface = new ethers.utils.Interface(PredictionWorld.abi);

            setAccount(accounts[0]);
            setProvider(web3Provider);
            setSmartAccount(smartAccount);
            setSureTokenContract(sureTokenContract);
            setSureTokenInterface(sureTokenInterface);
            setPredictionWorldContract(predictionWorldContract);
            setPredictionWorldInterface(predictionWorldInterface);
        }

        if (sdk.web3auth.status === "connected") {
            const user = await sdk.getUserInfo();
            if (!!user && !!user.email) {
                setEmail(user.email);
                // TODO: call api set email
            }
        }
        setSocialLoginSDK(sdk);
        return socialLoginSDK;
    }, [socialLoginSDK]);

    const disconnectWallet = async () => {
        if (!socialLoginSDK || !socialLoginSDK.web3auth) {
            console.error("Binconomy SDK not initialized");
            return;
        }

        await socialLoginSDK.logout();
        socialLoginSDK.hideWallet();
        setProvider(undefined);
        setAccount(undefined);
        // setSmartContractWalletAddress("");
    };

    useEffect(() => {
        if (socialLoginSDK && socialLoginSDK.provider) {
            socialLoginSDK.hideWallet();
        }
    }, [account, socialLoginSDK]);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (window?.socialLoginSDK?.provider) {
                clearInterval(interval);
            }
            if (socialLoginSDK?.provider && !account) {
                connectWallet();
            }
            return () => {
                clearInterval(interval);
            };
        }, 1000);
    }, [account, connectWallet, socialLoginSDK]);

    // useEffect(() => {
    //     async function setupSmartAccount() {
    //         const smartAccount = new SmartAccount(provider, {
    //             activeNetworkId: ChainId.POLYGON_MUMBAI,
    //             supportedNetworksIds: [ChainId.POLYGON_MUMBAI],
    //         });
    //         await smartAccount.init();
    //         const context = smartAccount.getSmartAccountContext();
    //     }
    //     if (!!provider && !!account) {
    //         setupSmartAccount();
    //         console.log(`Provider: ${provider}`);
    //     }
    // }, [account, provider]);

    useEffect(() => {
        connectWallet();
    }, []);

    return (
        <>
            <nav className="w-full h-16 mt-auto max-w-5xl">
                <div className="flex flex-row justify-between items-center h-full">
                    <Link href="/" passHref>
                        <span className="font-semibold text-xl cursor-pointer">Prediction World</span>
                    </Link>
                    {!router.asPath.includes("/market") && !router.asPath.includes("/admin") && (
                        <div className="flex flex-row items-center justify-center h-full">
                            <TabButton title="Market" isActive={router.asPath === "/"} url={"/"} />
                            <TabButton title="Portfolio" isActive={router.asPath === "/portfolio"} url={"/portfolio"} />
                        </div>
                    )}

                    {account ? (
                        <div className="flex">
                            <div className="bg-green-500 px-6 py-2 rounded-md cursor-pointer mx-4">
                                <span className="text-lg text-white">{email || `${account.substr(0, 10)}...`}</span>
                            </div>
                            <div className="bg-green-500 px-6 py-2 rounded-md cursor-pointer" onClick={disconnectWallet}>
                                <span className="text-lg text-white">Logout</span>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="bg-green-500 px-6 py-2 rounded-md cursor-pointer"
                            onClick={connectWallet} // original code is load all data
                        >
                            <span className="text-lg text-white">Connect</span>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
}

const TabButton = ({ title, isActive, url }) => {
    return (
        <Link href={url} passHref>
            <div
                className={`h-full px-4 flex items-center border-b-2 font-semibold hover:border-blue-700 hover:text-blue-700 cursor-pointer ${
                    isActive ? "border-blue-700 text-blue-700 text-lg font-semibold" : "border-white text-gray-400 text-lg"
                }`}
            >
                <span>{title}</span>
            </div>
        </Link>
    );
};
