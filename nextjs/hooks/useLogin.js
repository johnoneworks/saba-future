import { chainId, dappAPIKey, earlyBirdAddress, predictionWorldAddress, providerUrl, sureTokenAddress } from "@/config";
import { useAccountStore } from "@/store/useAccountStore";
import { useContractStore } from "@/store/useContractStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { usePlayerInfoStore } from "@/store/usePlayerInfoStore";
import EarlyBird from "@/utils/abis/EarlyBird.json";
import PredictionWorld from "@/utils/abis/PredictionWorld.json";
import SURE from "@/utils/abis/SureToken.json";
import SmartAccount from "@biconomy/smart-account";
import SocialLogin from "@biconomy/web3-auth";
import "@biconomy/web3-auth/dist/src/style.css";
import { ethers } from "ethers";
import { useCallback } from "react";

const useLogin = () => {
    const { setSocialLoginSDK, setAccount, setProvider, setSmartAccount } = useAccountStore();
    const {
        setPredictionWorldContract,
        setPredictionWorldInterface,
        setEarlyBirdContract,
        setEarlyBirdInterface,
        setSureTokenContract,
        setSureTokenInterface,
        setEarlyBirdValidState
    } = useContractStore();
    const { setEmail } = usePlayerInfoStore();
    const { setIsPageLoading } = useLoadingStore();

    const connectSDK = useCallback(async () => {
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
            setIsPageLoading(true);
            const web3Provider = new ethers.providers.Web3Provider(sdk.provider);
            const accounts = await web3Provider.listAccounts();

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
            const earlyBirdValidState = await earlyBirdContract.validate(smartAccountSdk.address);

            //get user email
            const user = await sdk.getUserInfo();
            if (!!user && !!user.email) {
                setEmail(user.email);
            }

            setAccount(accounts[0]);
            setProvider(web3Provider);
            setSmartAccount(smartAccountSdk);
            setIsPageLoading(false);

            setSureTokenContract(sureTokenContract);
            setSureTokenInterface(sureTokenInterface);
            setPredictionWorldContract(predictionWorldContract);
            setPredictionWorldInterface(predictionWorldInterface);
            setEarlyBirdContract(earlyBirdContract);
            setEarlyBirdInterface(earlyBirdInterface);
            setEarlyBirdValidState(earlyBirdValidState);
        }

        setSocialLoginSDK(sdk);
    }, [socialLoginSDK]);

    return { connectSDK };
};

export default useLogin;
