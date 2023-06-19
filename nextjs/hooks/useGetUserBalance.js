import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";

const useGetUserBalance = () => {
    const { account, sureTokenContract, smartAccount } = useContext(BiconomyAccountContext);
    const [balance, setBalance] = useState(0);

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

    return { balance, updateBalance };
};

export default useGetUserBalance;
