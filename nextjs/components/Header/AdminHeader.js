import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { PageContext } from "@/contexts/PageContext";
import useGetMarkets from "@/hooks/useGetMarkets";
import useGetUserBalance from "@/hooks/useGetUserBalance";
import useGetUserStatement from "@/hooks/useGetUserStatement";
import useLogout from "@/hooks/useLogout";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import RefreshIcon from "@mui/icons-material/Refresh";
import { styled } from "@mui/system";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Suspense, useContext } from "react";
import styles from "./Header.module.scss";

/**
 * TODO:
 * 1. refesh all markets
 */

const CustomPersonIcon = styled(PersonIcon)({
    fontSize: 16
});

const CustomAccountBalanceWalletIcon = styled(AccountBalanceWalletIcon)({
    fontSize: 16
});

const BiconomyWallet = dynamic(() => import("@/components/BiconomyWallet").then((res) => res.default), {
    ssr: false
});

const ProfileItem = ({ type, text }) => {
    return (
        <div className={styles.profileItem}>
            {type === "person" && <CustomPersonIcon />}

            {type === "wallet" && <CustomAccountBalanceWalletIcon />}
            <span> {text}</span>
        </div>
    );
};

export const AdminHeader = () => {
    const router = useRouter();
    const { account, email } = useContext(BiconomyAccountContext);
    const { currentMarketID, currentMenu, setCurrentMarketID } = useContext(PageContext);
    const { updateMarkets } = useGetMarkets();
    const { updateStatements } = useGetUserStatement();
    const { balance, updateBalance } = useGetUserBalance();
    const { disconnectWallet } = useLogout();

    const refreshMarkets = () => {
        updateMarkets();
        updateStatements();
        updateBalance();
    };

    const handleLogout = () => {
        if (account) {
            disconnectWallet();
        }
    };

    const handleReturnBack = () => {
        if (currentMarketID) {
            router.push({
                pathname: `/`,
                query: { menu: currentMenu }
            });
            setCurrentMarketID(null);
        }
    };

    return (
        <>
            <Suspense>
                <BiconomyWallet />
            </Suspense>
            <div className={styles.root}>
                <div className={styles.header}>
                    {/* TODO return back icon */}
                    <div onClick={refreshMarkets}>{<RefreshIcon />}</div>
                    <div> {account ? "Saba Future" : "Wallet Connecting..."} </div>
                    <div onClick={handleLogout}>{account ? <LogoutIcon /> : <LoginIcon />}</div>
                </div>
                {account && (
                    <div className={styles.headerInfo}>
                        <div className={styles.profile}>
                            <ProfileItem type="person" text={account ? email || `${account.substr(0, 10)}...` : ""} />
                            <ProfileItem type="wallet" text={balance ? `${balance} SURE` : ""} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
