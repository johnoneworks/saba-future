import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import SocialLogin from "@biconomy/web3-auth";
import SmartAccount from "@biconomy/smart-account";
import { ChainId } from "@biconomy/core-types";
import "@biconomy/web3-auth/dist/src/style.css"

import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";

export default function BiconomyNavbar() {
    const router = useRouter();
    const [socialLogin, setSocialLogin] = useContext(BiconomyAccountContext);
    const [account, setAccount] = useState(null);

    const connectWallet = async () => {
        console.log("connectWallet()");
        if (typeof window === "undefined") return;

        if (socialLogin?.provider) {
            const web3Provider = new ethers.providers.Web3Provider(
                socialLogin.provider
            );
            const accounts = await web3Provider.listAccounts();
            setAccount(accounts[0]);
            return;
        }

        let _socialLogin = socialLogin;
        if (!socialLogin) {
            _socialLogin = new SocialLogin();
            const chainId = 80001;
            const signature = await _socialLogin.whitelistUrl("https://saba-future.vercel.app");
            await _socialLogin.init({
                chainId: ethers.utils.hexValue(chainId),
                whitelistUrls: {
                    "https://saba-future.vercel.app": signature,
                },
            });
            setSocialLogin(_socialLogin);
        }

        if (_socialLogin.web3auth.status !== "connected") {
            await _socialLogin.showWallet();
        } else {
            const web3Provider = new ethers.providers.Web3Provider(
                _socialLogin.provider
            );
            const accounts = await web3Provider.listAccounts();
            setAccount(accounts[0]);
        }
    }

    const disconnectWallet = async () => {
        if (!socialLogin || !socialLogin.web3auth) {
            console.error("Binconomy SDK not initialized");
            return;
        }

        await socialLogin.logout();
        socialLogin.hideWallet();
        setAccount(undefined);
        setSocialLogin(null);
        // setSmartContractWalletAddress("");
    };

    useEffect(() => {
        connectWallet();
    }, []);

    return (
        <>
            <nav className="w-full h-16 mt-auto max-w-5xl">
                <div className="flex flex-row justify-between items-center h-full">
                    <Link href="/" passHref>
                        <span className="font-semibold text-xl cursor-pointer">
                            Prediction World
                        </span>
                    </Link>
                    {!router.asPath.includes("/market") &&
                        !router.asPath.includes("/admin") && (
                            <div className="flex flex-row items-center justify-center h-full">
                                <TabButton
                                    title="Market"
                                    isActive={router.asPath === "/"}
                                    url={"/"}
                                />
                                <TabButton
                                    title="Portfolio"
                                    isActive={router.asPath === "/portfolio"}
                                    url={"/portfolio"}
                                />
                            </div>
                        )}

                    {account ? (
                        <div
                            className="bg-green-500 px-6 py-2 rounded-md cursor-pointer"
                            onClick={disconnectWallet}
                        >
                            <span className="text-lg text-white">
                                {account.substr(0, 10)}...
                            </span>
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
                className={`h-full px-4 flex items-center border-b-2 font-semibold hover:border-blue-700 hover:text-blue-700 cursor-pointer ${isActive
                    ? "border-blue-700 text-blue-700 text-lg font-semibold"
                    : "border-white text-gray-400 text-lg"
                    }`}
            >
                <span>{title}</span>
            </div>
        </Link>
    );
};