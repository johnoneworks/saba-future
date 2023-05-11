//import '@/styles/globals.css'
import "tailwindcss/tailwind.css";
import "../styles/globals.css";

import { useState } from 'react';
import { AccountContext } from '../contexts/AccountContext';
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";

export default function App({ Component, pageProps }) {
  const [account, setAccount] = useState();
  const [socialLogin, setSocialLogin] = useState();

  return (

    <AccountContext.Provider value={[account, setAccount]}>
      <BiconomyAccountContext.Provider value={[socialLogin, setSocialLogin]}>
        <Component {...pageProps} />
      </BiconomyAccountContext.Provider>
    </AccountContext.Provider>

  );
}
