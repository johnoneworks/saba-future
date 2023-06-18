import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";

const useGetUserBalance = () => {
    const { account, sureTokenContract } = useContext(BiconomyAccountContext);
    const [balance, setBalance] = useState(0);

    const updateBalance = async () => {
        console.error("hook Balance account ", account);

        try {
            if (!account) {
                return;
            }
            let count = await sureTokenContract.balanceOf(account);
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
