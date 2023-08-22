import { API_SAVE_ACCOUNT } from "@/constants/Constant";
import useLogin from "@/hooks/useLogin";
import { useAccountStore } from "@/store/useAccountStore";
import { usePlayerInfoStore } from "@/store/usePlayerInfoStore";
import { currentDate } from "@/utils/ConvertDate";
import uuidv4 from "@/utils/Uuid";
import "@biconomy/web3-auth/dist/src/style.css";
import axios from "axios";
import { useEffect } from "react";
import PageLoading from "./LoadingPage/PageLoading";

export default function BiconomyWallet() {
    const { account, socialLoginSDK, provider, smartAccount } = useAccountStore();
    const { email, isSendAccountReady, setIsSendAccountReady } = usePlayerInfoStore();
    const { connectSDK } = useLogin();

    const connectWallet = async () => {
        connectSDK();
    };

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
                setIsSendAccountReady(!isSendAccountReady);
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
