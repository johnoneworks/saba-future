import { useAccountStore } from "@/store/useAccountStore";
import { useContractStore } from "@/store/useContractStore";
import { usePlayerInfoStore } from "@/store/usePlayerInfoStore";
import { ethers } from "ethers";
import { useEffect } from "react";

const useGetUserBalance = () => {
    const { account, smartAccount } = useAccountStore();
    const { sureTokenContract } = useContractStore();
    const { setBalance } = usePlayerInfoStore();

    const updateBalance = async () => {
        try {
            if (!smartAccount.address) {
                return;
            }
            let count = await sureTokenContract.balanceOf(smartAccount.address);
            console.error("hook Balance ", ethers.utils.commify(count));
            setBalance(ethers.utils.commify(count));
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
