import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import "@biconomy/web3-auth/dist/src/style.css";
import { useContext } from "react";

const useLogout = () => {
    const { setAccount, socialLoginSDK, setProvider, setisSendAccountReady } = useContext(BiconomyAccountContext);

    const disconnectWallet = async () => {
        if (!socialLoginSDK || !socialLoginSDK.web3auth) {
            console.error("Binconomy SDK not initialized");
            return;
        }

        await socialLoginSDK.logout();
        setisSendAccountReady(false); // reset send account status
        socialLoginSDK.hideWallet();
        setProvider(undefined);
        setAccount(undefined);
    };

    return { disconnectWallet };
};

export default useLogout;
