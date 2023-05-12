import dynamic from "next/dynamic";
import { useContext, useCallback, useEffect, Suspense } from "react";
import styles from "../styles/Home.module.css";
import SocialLogin from "@biconomy/web3-auth";
import { ethers } from "ethers";
import "@biconomy/web3-auth/dist/src/style.css";

import { TestContext } from "@/contexts/TestContext";

const Navbar2 = dynamic(
    () => import("../components/Navbar2").then((res) => res.default),
    {
        ssr: false,
    }
);

export default function Test() {
    const { 
        account2, setAccount2,
        socialLoginSDK, setSocialLoginSDK,
    } = useContext(TestContext);

    return (
        <div className={styles.container}>
            <Suspense fallback={<div>Loading...</div>}>
                <Navbar2 />
            </Suspense>
            {/*
            <p>Account: {account2}</p>
            <button onClick={() => setAccount2("Yup")}>Change Account</button>
            <p>SocialLogin: {socialLoginSDK === null ? "null" : "exists"}</p>
            */}   
        </div>
    );
}
