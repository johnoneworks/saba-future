import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import RefreshIcon from "@mui/icons-material/Refresh";
import { styled } from "@mui/system";
import classnames from "classnames";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense } from "react";
import styles from "./Header.module.scss";

/**
 * TODO:
 * 1. return back button
 * 2. add MUI style
 * 3. 個人資訊
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

const TabButton = ({ title, isActive, url }) => {
    return (
        <Link href={url} passHref>
            <div className={classnames(styles.tabItem, { [styles.active]: isActive })}>
                <span>{title}</span>
            </div>
        </Link>
    );
};

export const Header = () => {
    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <RefreshIcon />
                <div> Prediction World </div>
                <LogoutIcon />
            </div>
            <div className={styles.headerInfo}>
                <div className={styles.profile}>
                    <ProfileItem type="person" text="person" />
                    <ProfileItem type="wallet" text="wallet" />
                </div>
                <div className={styles.tab}>
                    <TabButton title="Market" isActive url={"/"} />
                    <TabButton title="Portfolio" url={"/portfolio"} />
                </div>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <BiconomyNavbar />
            </Suspense>
        </div>
    );
};
