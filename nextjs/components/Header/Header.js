import ProfileDialog from "@/components/ProfileDialog";
import useGetMarkets from "@/hooks/useGetMarkets";
import useGetUserBalance from "@/hooks/useGetUserBalance";
import useGetUserStatement from "@/hooks/useGetUserStatement";
import useLogout from "@/hooks/useLogout";
import { useAccountStore } from "@/store/useAccountStore";
import { useMenuStore } from "@/store/useMenuStore";
import { usePlayerInfoStore } from "@/store/usePlayerInfoStore";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import LanguageIcon from "@mui/icons-material/Language";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Button } from "@mui/material";
import classnames from "classnames";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import HowToPlay from "../HowToPlay/HowToPlay";
import { NewbieDialog } from "../NewbieDialog/NewbieDialog";
import styles from "./Header.module.scss";

const BiconomyWallet = dynamic(() => import("@/components/BiconomyWallet").then((res) => res.default), {
    ssr: false
});

const ProfileItem = ({ type, text }) => {
    return (
        <div className={styles.profileItem}>
            {type === "person" && <PersonIcon sx={{ fontSize: 16 }} />}

            {type === "wallet" && <AccountBalanceWalletIcon sx={{ fontSize: 16 }} />}
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
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isLanguageExpand, setIsLanguageExpand] = useState(false);
    const { t, i18n } = useTranslation();

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

    const handleDrawer = () => {
        if (isDrawerOpen === true) {
            setIsLanguageExpand(false);
        }
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleLanguageArea = () => {
        setIsLanguageExpand(!isLanguageExpand);
    };

    const handleSwitchLanguage = (lan) => {
        i18n.changeLanguage(lan);
    };

    // 測試 是否登入, 是否為manage
    let isLogin = false;
    let isManage = false;
    const menuList = [
        {
            icon: isLogin && isManage ? <ManageAccountsIcon sx={{ color: "#1A84F2" }} /> : <LightbulbIcon sx={{ color: "#1A84F2" }} />,
            menuTitle: isLogin && isManage ? "Manage markets" : "How To Play",
            clickAction: isLogin && isManage ? handleRedirectToAdminMarkets : handleSwitchHowToPlay
        },
        {
            icon: <LanguageIcon sx={{ color: "#1A84F2" }} />,
            menuTitle: "Language",
            clickAction: handleLanguageArea,
            languageArea: (
                <div className={classnames(styles.languageArea)}>
                    <button
                        onClick={() => {
                            handleSwitchLanguage("en");
                        }}
                    >
                        English
                    </button>
                    <button
                        onClick={() => {
                            handleSwitchLanguage("ind");
                        }}
                    >
                        English(India)
                    </button>
                    <button
                        onClick={() => {
                            handleSwitchLanguage("vn");
                        }}
                    >
                        Tiếng Việt
                    </button>
                    <button
                        onClick={() => {
                            handleSwitchLanguage("th");
                        }}
                    >
                        ภาษาไทย
                    </button>
                    <button
                        onClick={() => {
                            handleSwitchLanguage("idn");
                        }}
                    >
                        Indonesian
                    </button>
                </div>
            )
        },
        {
            icon: isLogin ? <LogoutIcon sx={{ color: "#1A84F2" }} /> : <LoginIcon sx={{ color: "#1A84F2" }} />,
            menuTitle: isLogin ? "Logout" : "Login",
            clickAction: isLogin ? handleLogout : handleLogin
        }
    ];

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
                        <Button onClick={handleDrawer}>
                            <MenuIcon sx={{ color: "#ffffff" }} />
                        </Button>
                        {isDrawerOpen && (
                            <div className={classnames(styles.drawerContainer)}>
                                <div className={classnames(styles.closeDrawer)}>
                                    <CloseIcon onClick={handleDrawer} sx={{ color: "#1A84F2" }} />
                                </div>
                                {menuList.map((item) => (
                                    <div className={classnames(styles.list)}>
                                        <div className={classnames(styles.listItem)} onClick={item.clickAction}>
                                            {item.icon}
                                            <span className={classnames(styles.listItemName)}>{item.menuTitle}</span>
                                        </div>
                                        {isLanguageExpand ? item.languageArea : <></>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {/* {account && ( */}
                <div className={styles.headerInfo}>
                    <div className={styles.profile} onClick={handleClickProfile}>
                        <ProfileItem type="person" text={account ? email || `${account.substr(0, 10)}...` : ""} />
                        <ProfileItem type="wallet" text={balance ? `${balance} SURE` : ""} />
                    </div>
                    {!currentMarketID && (
                        <div className={styles.tab}>
                            <MenuTab tab={t("market")} />
                            <MenuTab tab={t("statement")} />
                        </div>
                    )}
                </div>
                {/* )} */}
            </div>
            {smartAccount && (
                <ProfileDialog open={openProfileDialog} smartAccount={smartAccount} email={email} balance={balance} onClose={handleCloseProfileDialog} />
            )}
            <NewbieDialog />
            {openHowToPlayDialog && <HowToPlay onClose={handleSwitchHowToPlay} />}
        </>
    );
};
