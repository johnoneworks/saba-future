import { chainId, dappAPIKey, earlyBirdAddress, predictionWorldAddress, providerUrl, sureTokenAddress } from "@/config";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import { currentDate } from "@/utils/ConvertDate";
import EarlyBird from "@/utils/abis/EarlyBird.json";
import PredictionWorld from "@/utils/abis/PredictionWorld.json";
import SURE from "@/utils/abis/SureToken.json";
import SmartAccount from "@biconomy/smart-account";
import SocialLogin from "@biconomy/web3-auth";
import "@biconomy/web3-auth/dist/src/style.css";
import { ethers } from "ethers";
import { useCallback, useContext, useEffect } from "react";
import syncCustInfo from "../service/auth";
import PageLoading from "./LoadingPage/PageLoading";

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
        setEarlyBirdContract,
        setEarlyBirdInterface,
        email,
        setEmail,
        isSendAccountReady,
        setisSendAccountReady,
        setEarlyBirdValidState
    } = useContext(BiconomyAccountContext);
    const { setIsPageLoading } = useContext(LoadingContext);

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
            const currentUrl = window.location.origin;
            const signature = await sdk.whitelistUrl(currentUrl);
            await sdk.init({
                chainId: ethers.utils.hexValue(chainId),
                whitelistUrls: {
                    [currentUrl]: signature
                }
            });
        }

        if (sdk.web3auth.status === "connected") {
            const web3Provider = new ethers.providers.Web3Provider(sdk.provider);
            const accounts = await web3Provider.listAccounts();
            setIsPageLoading(true);
            console.log(`account:${accounts[0]}`);

            const smartAccountOptions = {
                activeNetworkId: chainId,
                supportedNetworksIds: [chainId],
                networkConfig: [
                    {
                        chainId: chainId,
                        dappAPIKey: dappAPIKey,
                        providerUrl: providerUrl
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
            smartAccountSdk.isAdminUser = await predictionWorldContract.isAdminUser(smartAccountSdk.address);

            const earlyBirdContract = new ethers.Contract(earlyBirdAddress, EarlyBird.abi, signer);
            const earlyBirdInterface = new ethers.utils.Interface(EarlyBird.abi);

            // 1: Valid
            // 2: All Occupied
            // 3: Already Exists
            const earlyBirdValidState = await earlyBirdContract.validate(smartAccountSdk.address);

            //get user email
            const user = await sdk.getUserInfo();
            if (!!user && !!user.email) {
                setEmail(user.email);
            }

            setAccount(accounts[0]);
            setProvider(web3Provider);
            setSmartAccount(smartAccountSdk);
            setSureTokenContract(sureTokenContract);
            setSureTokenInterface(sureTokenInterface);
            setPredictionWorldContract(predictionWorldContract);
            setPredictionWorldInterface(predictionWorldInterface);
            setEarlyBirdContract(earlyBirdContract);
            setEarlyBirdInterface(earlyBirdInterface);
            setIsPageLoading(false);
            setEarlyBirdValidState(earlyBirdValidState);
        } else {
        }

        setSocialLoginSDK(sdk);
        return socialLoginSDK;
    }, [socialLoginSDK]);

    const sendAccountData = async ({ smartAccountAddress, email, isSendAccountReady }) => {
        try {
            const response = await syncCustInfo({
                currentDate: currentDate(),
                walletId: smartAccountAddress,
                email: email
            });

            if (!!response && response.ErrorCode === 0) {
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

    useEffect(() => {
        connectWallet();
    }, []);

    return <PageLoading />;
}
