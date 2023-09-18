import syncGetBalance from "@/service/wallet/getBalance";
import { useAccountStore } from "@/store/useAccountStore";
import { useEffect } from "react";

const useGetUserBalance = () => {
    const { account, setBalance } = useAccountStore();

    const updateBalance = async () => {
        try {
            const response = await syncGetBalance();
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
