import ProfileDialog from "@/components/ProfileDialog";
import { MENU_TYPE } from "@/constants/Constant";
import useGetMarkets from "@/hooks/useGetMarkets";
import useGetUserBalance from "@/hooks/useGetUserBalance";
import useGetUserStatement from "@/hooks/useGetUserStatement";
import useLogout from "@/hooks/useLogout";
import { useAccountStore } from "@/store/useAccountStore";
import { useMenuStore } from "@/store/useMenuStore";
import { usePlayerInfoStore } from "@/store/usePlayerInfoStore";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonIcon from "@mui/icons-material/Person";
import RefreshIcon from "@mui/icons-material/Refresh";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/system";
import classnames from "classnames";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import HowToPlay from "../HowToPlay/HowToPlay";
import { NewbieDialog } from "../NewbieDialog/NewbieDialog";
import styles from "./Header.module.scss";

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
    const { currentMenu, setCurrentMenu } = useMenuStore();
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
    const { account, smartAccount, socialLoginSDK } = useAccountStore();
    const { email, balance } = usePlayerInfoStore();
    const { currentMarketID, currentMenu, setCurrentMarketID } = useMenuStore();
    const { updateMarkets } = useGetMarkets();
    const { updateStatements } = useGetUserStatement();
    const { updateBalance } = useGetUserBalance();
    const { disconnectWallet } = useLogout();
    const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const [openHowToPlayDialog, setOpenHowToPlayDialog] = useState(false);

    const refreshMarkets = () => {
        updateMarkets();
        updateStatements();
        updateBalance();
    };

    const handleRedirectToAdminMarkets = () => {
        router.push({
            pathname: `/admin/markets`
        });
    };

    const handleLogout = () => {
        if (account) {
            disconnectWallet();
        }
    };

    const handleLogin = async () => {
        if (!account && socialLoginSDK.web3auth.status !== "connected") {
            await socialLoginSDK.showWallet();
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

    const handleSwitchHowToPlay = () => {
        setOpenHowToPlayDialog(!openHowToPlayDialog);
    };

    return (
        <>
            <BiconomyWallet />
            <div className={styles.root}>
                <div className={styles.header}>
                    <div onClick={currentMarketID ? handleReturnBack : refreshMarkets}>{currentMarketID ? <ArrowBackIcon /> : <RefreshIcon />}</div>
                    <div className={styles.logo}>
                        <Image src="/logo-text.svg" alt="placeholder" width={150} height={30} />
                    </div>
                    <div>
                        {account && smartAccount && smartAccount.isAdminUser ? (
                            <span className="cursor-pointer pr-4" onClick={handleRedirectToAdminMarkets}>
                                {
                                    <Tooltip title="Manage markets">
                                        <ManageAccountsIcon />
                                    </Tooltip>
                                }
                            </span>
                        ) : (
                            <span onClick={handleSwitchHowToPlay} className="pr-4">
                                <LightbulbIcon />
                            </span>
                        )}
                        <span className="cursor-pointer" onClick={account ? handleLogout : handleLogin}>
                            {account ? <LogoutIcon /> : <LoginIcon />}
                        </span>
                    </div>
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
            {smartAccount && (
                <ProfileDialog open={openProfileDialog} smartAccount={smartAccount} email={email} balance={balance} onClose={handleCloseProfileDialog} />
            )}
            <NewbieDialog />
            {openHowToPlayDialog && <HowToPlay onClose={handleSwitchHowToPlay} />}
        </>
    );
};
