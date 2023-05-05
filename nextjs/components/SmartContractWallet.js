import { useState, useCallback, useEffect } from "react";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import SocialLogin from "@biconomy/web3-auth";
import SmartAccount from "@biconomy/smart-account";
import { ChainId } from "@biconomy/core-types";
import Head from "next/head";

export default function SmartContractWallet() {
    const [provider, setProvider] = useState(undefined);
    const [account, setAccount] = useState("");
    const [smartAccount, setSmartAccount] = useState(null);
    const [socialLoginSDK, setSocialLoginSDK] = useState(null);
    const [smartContractWalletAddress, setSmartContractWalletAddress] = useState("");
    const [smartContractWalletLoading, setSmartContractWalletLoading] = useState(false);

    const connectWeb3 = useCallback(async () => {
        console.log("here");
        if (typeof window === "undefined") return;
        console.log(`socialLoginSDK: ${socialLoginSDK}`);

        // use biconomy detected provider if it exists
        if (socialLoginSDK?.provider) {
            const web3Provider = new ethers.providers.Web3Provider(
                socialLoginSDK.provider
            );
            setProvider(web3Provider);
            const accounts = await web3Provider.listAccounts();
            setAccount(accounts[0]);
            return;
        }

        // no providers chosen, show wallet selection
        if (socialLoginSDK) {
            socialLoginSDK.showWallet();
            return socialLoginSDK;
        }

        // no biconomy SDK, initialize it
        const sdk = new SocialLogin();
        const chainId = 80001; // mumbai
        // according to document, will need to whitelistUrl for deployment
        const signature = await sdk.whitelistUrl("https://saba-future.vercel.app");
        await sdk.init({
            chainId: ethers.utils.hexValue(chainId),
            whitelistUrls: {
                "https://saba-future.vercel.app": signature,
            },
        });
        setSocialLoginSDK(sdk);
        sdk.showWallet();
        return socialLoginSDK;

    }, [socialLoginSDK]);

    // if wallet is connected, close the widget
    useEffect(() => {
        console.log("connected, hide the wallet");
        if (socialLoginSDK && socialLoginSDK.provider) {
            socialLoginSDK.hideWallet();
        }
    }, [account, socialLoginSDK]); // I feel account is not needed?

    // after metamask login -> get provider event *not sure why this is metamask specific
    // maybe sometimes metamask is slow in providing account?
    useEffect(() => {
        const interval = setInterval(async () => {
            if (account) {
                clearInterval(interval);
            }
            if (socialLoginSDK?.provider && !account) {
                connectWeb3();
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [account, connectWeb3, socialLoginSDK]);

    const disconnectWeb3 = async () => {
        if (!socialLoginSDK || !socialLoginSDK.web3auth) {
            console.error("Biconomy SDK not initialized");
            return;
        }

        await socialLoginSDK.logout();
        socialLoginSDK.hideWallet();
        setProvider(undefined);
        setAccount(undefined);
        setSmartContractWalletAddress("");
    };

    useEffect(() => {
        async function setupSmartAccount() {
            setSmartContractWalletAddress("");
            setSmartContractWalletLoading(true);
            // from docs I need the Dapp API key
            const smartAccount = new SmartAccount(provider, {
                activeNetworkId: ChainId.POLYGON_MUMBAI,
                supportedNetworksIds: [ChainId.POLYGON_MUMBAI],
            });
            await smartAccount.init();
            const context = smartAccount.getSmartAccountContext();
            setSmartContractWalletAddress(context.baseWallet.getAddress());
            setSmartAccount(smartAccount);
            setSmartContractWalletLoading(false);
        }
        if (!!provider && !!account) {
            setupSmartAccount();
            console.log(`Provider: ${provider}`);
        }

    }, [account, provider]);

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1>Biconomy Login</h1>
                <button onClick={!account ? connectWeb3 : disconnectWeb3}>
                    {!account ? "Connect Wallet" : "Disconnect Wallet"}
                </button>
                {account && (
                    <div>
                        <h2>EOA Address</h2>
                        <p>{account}</p>
                    </div>
                )}

                {smartContractWalletLoading && <h2>Loading Smart Account...</h2>}

                {smartContractWalletAddress && (
                    <div>
                        <h2>Smart Account Address</h2>
                        <p>{smartContractWalletAddress}</p>
                    </div>
                )}
            </main>
        </div>
    );
}