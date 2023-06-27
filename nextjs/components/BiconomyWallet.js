import { ChainId } from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";
import SocialLogin from "@biconomy/web3-auth";
import "@biconomy/web3-auth/dist/src/style.css";
import { ethers } from "ethers";
import { useCallback, useContext, useEffect } from "react";

import { predictionWorldAddress, sureTokenAddress } from "@/config";
import { API_SAVE_ACCOUNT } from "@/constants/Constant";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { currentDate } from "@/utils/ConvertDate";
import uuidv4 from "@/utils/Uuid";
import PredictionWorld from "@/utils/abis/PredictionWorld.json";
import SURE from "@/utils/abis/SureToken.json";
import axios from "axios";
import PageLoading from "./LoadingPage/PageLoading";

/**
 * TODO
 * 1.
 *
 */

export default function BiconomyWallet() {
    const {
        account,
        setAccount,
        socialLoginSDK,
        setSocialLoginSDK,
        provider,
        setProvider,
        smartAccount,
        setSmartAccount,
        setSureTokenContract,
        setSureTokenInterface,
        setPredictionWorldContract,
        setPredictionWorldInterface,
        email,
        setEmail,
        isSendAccountReady,
        setisSendAccountReady
    } = useContext(BiconomyAccountContext);
    const { setIsPageLoading } = useContext(LoadingContext);

    const connectWallet = useCallback(async () => {
        setIsPageLoading(true);
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

            let smartAccountSdk = new SmartAccount(web3Provider, smartAccountOptions);
            smartAccountSdk = await smartAccountSdk.init();

            console.log("%c⧭ Smart Account Owner:", "color: #807160", smartAccountSdk.owner);
            console.log("%c⧭ Smart Contract Wallet:", "color: #007300", smartAccountSdk.address);

            const signer = web3Provider.getSigner();
            const sureTokenContract = new ethers.Contract(sureTokenAddress, SURE.abi, signer);
            const sureTokenInterface = new ethers.utils.Interface(SURE.abi);

            const predictionWorldContract = new ethers.Contract(predictionWorldAddress, PredictionWorld.abi, signer);
            const predictionWorldInterface = new ethers.utils.Interface(PredictionWorld.abi);

            setAccount(accounts[0]);
            setProvider(web3Provider);
            setSmartAccount(smartAccountSdk);
            setSureTokenContract(sureTokenContract);
            setSureTokenInterface(sureTokenInterface);
            setPredictionWorldContract(predictionWorldContract);
            setPredictionWorldInterface(predictionWorldInterface);
            setIsPageLoading(false);
        }

        if (sdk.web3auth.status === "connected") {
            const user = await sdk.getUserInfo();
            if (!!user && !!user.email) {
                setEmail(user.email);
            }
        }

        setSocialLoginSDK(sdk);
        return socialLoginSDK;
    }, [socialLoginSDK]);

    const sendAccountData = async ({ smartAccountAddress, email, isSendAccountReady }) => {
        try {
            const requestBody = {
                TimeStamp: currentDate(),
                Seq: uuidv4(),
                WalletId: smartAccountAddress,
                Email: email
            };
            const response = await axios.post(API_SAVE_ACCOUNT, requestBody, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (!!response && !!response.data && response.data.ErrorCode === 0) {
                setisSendAccountReady(!isSendAccountReady);
            }
        } catch (error) {
            console.log("%c⧭ accoutSaveApiIsError", "color: #731d6d", error);
        }
    };

    useEffect(() => {
        // only send account to server when smartAccount is ready in once
        if (!!smartAccount && !!smartAccount.address && !!email && !isSendAccountReady) {
            sendAccountData({ smartAccountAddress: smartAccount.address, email, isSendAccountReady });
        }
    }, [smartAccount]);

    useEffect(() => {
        if (socialLoginSDK && socialLoginSDK.provider) {
            socialLoginSDK.hideWallet();
        }
    }, [account, socialLoginSDK, provider]);

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

    //持續檢查玩家未登入，如未登入就show wallet
    useEffect(() => {
        const interval = setInterval(async () => {
            if (window?.socialLoginSDK?.provider) {
                clearInterval(interval);
            }
            if (!provider && !account) {
                if (socialLoginSDK && socialLoginSDK.status !== "connected") {
                    await socialLoginSDK.showWallet();
                }
            }

            return () => {
                clearInterval(interval);
            };
        }, 2000);
    }, [account, socialLoginSDK, provider]);

    useEffect(() => {
        connectWallet();
    }, []);

    return <PageLoading />;
}
