import syncGetBalance from "@/service/wallet/getBalance";
import { useAccountStore } from "@/store/useAccountStore";
import { usePlayerInfoStore } from "@/store/usePlayerInfoStore";
import { useEffect } from "react";

const useGetUserBalance = () => {
    const { account } = useAccountStore();
    const { setBalance } = usePlayerInfoStore();

    const updateBalance = async () => {
        try {
            let response = await syncGetBalance();
            if (!!response && response.ErrorCode === 0) {
                setBalance(response.Result.Balance);
            }
        } catch (error) {
            console.error(`Error getting balance, ${error}`);
        }
    };

    useEffect(() => {
        updateBalance();
    }, [account]);

    return { updateBalance };
};

export default useGetUserBalance;
