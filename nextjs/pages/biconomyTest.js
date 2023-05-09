import dynamic from "next/dynamic";
import { Suspense } from "react";
import Head from "next/head";

import styles from "../styles/Home.module.css";
import BiconomyNavbar from "@/components/BiconomyNavbar";

export default function BiconomyTest() {
    const SocialLoginDynamic = dynamic(
        () => import("../components/SmartContractWallet").then((res) => res.default),
        {
            ssr: false,            
        }
    );

    return (
        <div className={styles.container}>
            <Head>
                <title>Prediction World</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <BiconomyNavbar />
            <Suspense fallback={<div>Loading...</div>}>         
                <SocialLoginDynamic />
            </Suspense> 
        </div>
    );
}