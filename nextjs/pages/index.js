import Head from "next/head";

import WalletHeader  from "../components/WalletHeader";
import Navbar from "../components/Navbar";
import styles from "../styles/Home.module.css";

export default function Home() {

  return (
    <div className={styles.container}>
      <Head>
        <title>Prediction World</title>
      </Head>
    </div>
  );

  /*
  return (
    <div className='flex flex-col items-center pt-32 bg-[#0B132B] text-[#d3d3d3] min-h-screen'>
      <WalletHeader />
      <Navbar />
    </div>
	);
  */
}
