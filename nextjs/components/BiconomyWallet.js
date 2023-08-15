import useLogin from "@/hooks/useLogin";
import { useAccountStore } from "@/store/useAccountStore";
import { usePlayerInfoStore } from "@/store/usePlayerInfoStore";
import { currentDate } from "@/utils/ConvertDate";
import "@biconomy/web3-auth/dist/src/style.css";
import { useEffect } from "react";
import syncCustInfo from "../service/auth";
import PageLoading from "./LoadingPage/PageLoading";

export default function BiconomyWallet() {
    const { account, socialLoginSDK, provider, smartAccount } = useAccountStore();
    const { email, isSendAccountReady, setisSendAccountReady } = usePlayerInfoStore();
    const { connectSDK } = useLogin();

    const connectWallet = async () => {
        connectSDK();
    };

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
