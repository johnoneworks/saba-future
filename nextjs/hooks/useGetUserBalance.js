import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { UserInfoContext } from "@/contexts/UserInfoContext";
import { ethers } from "ethers";
import { useContext, useEffect } from "react";

const useGetUserBalance = () => {
    const { account, sureTokenContract, smartAccount } = useContext(BiconomyAccountContext);
    const { setBalance } = useContext(UserInfoContext);

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
