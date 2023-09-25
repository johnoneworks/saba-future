import ProfileDialog from "@/components/ProfileDialog/ProfileDialog";
import { LANGUAGES, MENU_TYPE, SESSION_STORAGE } from "@/constants/Constant";
import useGetMarkets from "@/hooks/useGetMarkets";
import useGetUserBalance from "@/hooks/useGetUserBalance";
import useLogin from "@/hooks/useLogin";
import { useAccountStore } from "@/store/useAccountStore";
import { useMenuStore } from "@/store/useMenuStore";
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
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import HowToPlay from "../HowToPlay/HowToPlay";
import styles from "./Header.module.scss";

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
    const { t } = useTranslation();
    return (
        <div
            className={classnames(styles.tabItem, { [styles.active]: tab === currentMenu })}
            onClick={() => {
                setCurrentMenu(tab);
                const directPath = tab === MENU_TYPE.MARKET ? "/" : "/Statement";
                router.push({
                    pathname: directPath,
                    query: { menu: tab }
                });
            }}
        >
            <span>{t(`${tab.toLowerCase()}`)}</span>
        </div>
    );
};

export const Header = (props) => {
    const { refreshStatement } = props;
    const router = useRouter();
    const { nickName, isAdmin, setClearAllAccount, balance } = useAccountStore();
    const { currentMarketID, currentMenu, setCurrentMarketID } = useMenuStore();
    const { updateMarkets } = useGetMarkets();
    const { updateBalance } = useGetUserBalance();
    const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const [openHowToPlayDialog, setOpenHowToPlayDialog] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isLanguageExpand, setIsLanguageExpand] = useState(false);
    const { i18n, t } = useTranslation();
    const { redirectGoogleLogin } = useLogin();

    const refreshMarkets = () => {
        if (currentMenu === MENU_TYPE.MARKET) {
            updateMarkets();
        } else if (currentMenu === MENU_TYPE.STATEMENT) {
            refreshStatement();
        }
        if (!!nickName) {
            updateBalance();
        }
    };

    const handleRedirectToAdminMarkets = () => {
        setIsDrawerOpen(false);
        router.push({
            pathname: `/admin/markets`
        });
    };

    const handleLogout = () => {
        setIsDrawerOpen(false);
        sessionStorage.removeItem(SESSION_STORAGE.LOGIN_INFO);
        setClearAllAccount();
        router.push({
            pathname: `/`
        });
    };

    const handleLogin = async () => {
        redirectGoogleLogin();
    };

    const handleReturnBack = () => {
        const directPath = currentMenu === MENU_TYPE.MARKET ? "/" : "/Statement";
        if (currentMarketID) {
            router.push({
                pathname: directPath,
                query: { menu: currentMenu }
            });
            if (currentMenu === MENU_TYPE.MARKET) updateMarkets();
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
        setIsDrawerOpen(false);
        setOpenHowToPlayDialog(!openHowToPlayDialog);
    };

    const handleDrawer = () => {
        setIsLanguageExpand(isDrawerOpen);
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleLanguageArea = () => {
        setIsLanguageExpand(!isLanguageExpand);
    };

    const handleSwitchLanguage = (lan) => {
        setIsDrawerOpen(false);
        setIsLanguageExpand(false);
        i18n.changeLanguage(lan);
        sessionStorage.setItem(SESSION_STORAGE.DEFAULT_LANGUAGE, lan);
    };

    const languages = [
        {
            language: LANGUAGES.EN,
            languageName: "English"
        },
        {
            language: LANGUAGES.IN,
            languageName: "English(India)"
        },
        {
            language: LANGUAGES.VN,
            languageName: "Tiếng Việt"
        },
        {
            language: LANGUAGES.TH,
            languageName: "ภาษาไทย"
        },
        {
            language: LANGUAGES.ID,
            languageName: "Indonesian"
        }
    ];

    return (
        <>
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
                                {nickName && isAdmin ? (
                                    <div className={classnames(styles.list)}>
                                        <div className={classnames(styles.listItem)} onClick={handleRedirectToAdminMarkets}>
                                            <ManageAccountsIcon sx={{ color: "#1A84F2" }} />
                                            <span className={classnames(styles.listItemName)}>{t("manage_markets")}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={classnames(styles.list)}>
                                        <div className={classnames(styles.listItem)} onClick={handleSwitchHowToPlay}>
                                            <LightbulbIcon sx={{ color: "#1A84F2" }} />
                                            <span className={classnames(styles.listItemName)}>{t("how_to_play")}</span>
                                        </div>
                                    </div>
                                )}
                                <div className={classnames(styles.list)}>
                                    <div className={classnames(styles.listItem)} onClick={handleLanguageArea}>
                                        <LanguageIcon sx={{ color: "#1A84F2" }} />
                                        <span className={classnames(styles.listItemName)}>{t("language")}</span>
                                    </div>
                                    {isLanguageExpand && (
                                        <div className={classnames(styles.languageArea)}>
                                            {languages.map((item) => (
                                                <button
                                                    onClick={() => {
                                                        handleSwitchLanguage(item.language);
                                                    }}
                                                >
                                                    {item.languageName}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {nickName ? (
                                    <div className={classnames(styles.list)}>
                                        <div className={classnames(styles.listItem)} onClick={handleLogout}>
                                            <LogoutIcon sx={{ color: "#1A84F2" }} />
                                            <span className={classnames(styles.listItemName)}>{t("logout")}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={classnames(styles.list)}>
                                        <div className={classnames(styles.listItem)} onClick={handleLogin}>
                                            <LoginIcon sx={{ color: "#1A84F2" }} />
                                            <span className={classnames(styles.listItemName)}>{t("login")}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {nickName && (
                    <div className={styles.headerInfo}>
                        <div className={styles.profile} onClick={handleClickProfile}>
                            <ProfileItem type="person" text={nickName} />
                            <ProfileItem type="wallet" text={`${balance} ${t("stake_unit")}`} />
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
            {openProfileDialog && <ProfileDialog onClose={handleCloseProfileDialog} />}
            {openHowToPlayDialog && <HowToPlay onClose={handleSwitchHowToPlay} />}
        </>
    );
};
