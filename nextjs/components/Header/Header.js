import ProfileDialog from "@/components/ProfileDialog";
import { MENU_TYPE } from "@/constants/Constant";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { PageContext } from "@/contexts/PageContext";
import { UserInfoContext } from "@/contexts/UserInfoContext";
import useGetMarkets from "@/hooks/useGetMarkets";
import useGetUserBalance from "@/hooks/useGetUserBalance";
import useGetUserStatement from "@/hooks/useGetUserStatement";
import useLogout from "@/hooks/useLogout";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import RefreshIcon from "@mui/icons-material/Refresh";
import { styled } from "@mui/system";
import classnames from "classnames";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { Suspense, useContext, useState } from "react";
import { NewbieDialog } from "../NewbieDialog/NewbieDialog";
import styles from "./Header.module.scss";

/**
 * TODO:
 * 1. return back button √
 * 2. add MUI style √
 * 3. 個人資訊 icon √
 * 4. Login / Logout Logic √
 * 5. newbie dialog refactor
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
    const router = useRouter();
    const { account, email, smartAccount } = useContext(BiconomyAccountContext);
    const { currentMarketID, currentMenu, setCurrentMarketID } = useContext(PageContext);
    const { balance } = useContext(UserInfoContext);
    const { updateMarkets } = useGetMarkets();
    const { updateStatements } = useGetUserStatement();
    const { updateBalance } = useGetUserBalance();
    const { disconnectWallet } = useLogout();
    const [openProfileDialog, setOpenProfileDialog] = useState(false);

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
            refreshMarkets();
            setCurrentMarketID(null);
        }
    };

    const handleClickProfile = () => {
        setOpenProfileDialog(true);
    };

    const handleCloseProfileDialog = () => {
        setOpenProfileDialog(false);
    };

    return (
        <>
            <Suspense>
                <BiconomyWallet />
            </Suspense>
            <div className={styles.root}>
                <div className={styles.header}>
                    <div onClick={currentMarketID ? handleReturnBack : refreshMarkets}>{currentMarketID ? <ArrowBackIcon /> : <RefreshIcon />}</div>
                    <div className={styles.logo}>
                        <Image src="/logo.svg" alt="placeholder" width={20} height={20} margin={20} />
                        <span style={{ marginLeft: 10 }}>{account ? "Saba Future" : "Wallet Connecting..."} </span>
                    </div>
                    <div onClick={handleLogout}>{account ? <LogoutIcon /> : <LoginIcon />}</div>
                </div>
                {account && (
                    <div className={styles.headerInfo}>
                        <div className={styles.profile} onClick={handleClickProfile}>
                            <ProfileItem type="person" text={account ? email || `${account.substr(0, 10)}...` : ""} />
                            <ProfileItem type="wallet" text={balance ? `${balance} SURE` : ""} />
                        </div>
                        {!currentMarketID && (
                            <div className={styles.tab}>
                                <MenuTab tab={MENU_TYPE.MARKET} />
                                <MenuTab tab={MENU_TYPE.STATEMENT} />
                            </div>
                        )}
                    </div>
                )}
            </div>
            {
                smartAccount &&
                <ProfileDialog open={openProfileDialog} smartAccount={smartAccount} email={email} balance={balance} onClose={handleCloseProfileDialog} />
            }
            <NewbieDialog />
        </>
    );
};
