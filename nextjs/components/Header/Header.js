import { MENU_TYPE } from "@/constants/Constant";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { PageContext } from "@/contexts/PageContext";
import useGetMarkets from "@/hooks/useGetMarkets";
import useGetUserBalance from "@/hooks/useGetUserBalance";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import RefreshIcon from "@mui/icons-material/Refresh";
import { styled } from "@mui/system";
import classnames from "classnames";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Suspense, useContext } from "react";
import styles from "./Header.module.scss";

/**
 * TODO:
 * 1. return back button
 * 2. add MUI style √
 * 3. 個人資訊 icon √
 * 4. Login / Logout Logic
 */

const CustomPersonIcon = styled(PersonIcon)({
    fontSize: 16
});

const CustomAccountBalanceWalletIcon = styled(AccountBalanceWalletIcon)({
    fontSize: 16
});

const BiconomyNavbar = dynamic(() => import("@/components/BiconomyNavbar").then((res) => res.default), {
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

const MenuTab = ({ tab }) => {
    const { currentMenu, setCurrentMenu } = useContext(PageContext);
    const router = useRouter();
    return (
        <div
            className={classnames(styles.tabItem, { [styles.active]: tab === currentMenu })}
            onClick={() => {
                setCurrentMenu(tab);
                router.push({
                    pathname: `/`,
                    query: { menu: tab }
                });
            }}
        >
            <span>{tab}</span>
        </div>
    );
};

export const Header = () => {
    const { account, email } = useContext(BiconomyAccountContext);
    const { markets, updateMarkets } = useGetMarkets();
    const { balance, updateBalance } = useGetUserBalance();

    const refreshMarkets = () => {
        updateMarkets();
    };

    const handleLogout = () => {
        //TODO
    };

    const handleReturnBack = () => {
        //TODO
    };

    return (
        <>
            <Suspense>
                <BiconomyNavbar />
            </Suspense>
            <div className={styles.root}>
                <div className={styles.header}>
                    <div onClick={refreshMarkets}>
                        <RefreshIcon />
                    </div>
                    <div> {account ? "Prediction World" : "Connecting Wallet..."} </div>
                    <div onClick={handleLogout}>
                        <LogoutIcon />
                    </div>
                </div>
                {account && (
                    <div className={styles.headerInfo}>
                        <div className={styles.profile}>
                            <ProfileItem type="person" text={account ? email || `${account.substr(0, 10)}...` : ""} />
                            <ProfileItem type="wallet" text={balance ? `${balance} SURE` : ""} />
                        </div>
                        <div className={styles.tab}>
                            <MenuTab tab={MENU_TYPE.MARKET} />
                            <MenuTab tab={MENU_TYPE.STATEMENT} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
