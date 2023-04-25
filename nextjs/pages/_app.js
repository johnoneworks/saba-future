//import '@/styles/globals.css'
import "tailwindcss/tailwind.css";
import "../styles/globals.css";

import { useState } from 'react';
import { AccountContext } from '../contexts/AccountContext';

export default function App({ Component, pageProps }) {
  const [account, setAccount] = useState();

  return (
    <AccountContext.Provider value={[account, setAccount]}>
      <Component {...pageProps} />
    </AccountContext.Provider>
  );
}
