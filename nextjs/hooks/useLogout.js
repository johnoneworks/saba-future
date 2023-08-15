import { useAccountStore } from "@/store/useAccountStore";
import { usePlayerInfoStore } from "@/store/usePlayerInfoStore";
import "@biconomy/web3-auth/dist/src/style.css";

const useLogout = () => {
    const { setAccount, socialLoginSDK, setProvider } = useAccountStore();
    const { setisSendAccountReady } = usePlayerInfoStore();

    const disconnectWallet = async () => {
        if (!socialLoginSDK || !socialLoginSDK.web3auth) {
            console.error("Binconomy SDK not initialized");
            return;
        }

        await socialLoginSDK.logout();
        setisSendAccountReady(false);
        socialLoginSDK.hideWallet();
        setProvider(undefined);
        setAccount(undefined);
    };

    return { disconnectWallet };
};

export default useLogout;
