//import '@/styles/globals.css'
import "tailwindcss/tailwind.css";
import "../styles/globals.css";

import { useState } from 'react';
import { AccountContext } from '../contexts/AccountContext';
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { TestContext } from "@/contexts/TestContext";

export default function App({ Component, pageProps }) {
  const [account, setAccount] = useState();

  // testing
  const [account2, setAccount2] = useState("no one yet");
  const [socialLoginSDK, setSocialLoginSDK] = useState(null);
  const [provider, setProvider] = useState(null);
  const [smartAccount, setSmartAccount] = useState(null);
  const [sureTokenContract, setSureTokenContract] = useState(null);
  const [sureTokenInterface, setSureTokenInterface] = useState(null);
  const [predictionWorldContract, setPredictionWorldContract] = useState(null);
  const [predictionWorldInterface, setPredictionWorldInterface] = useState(null);
  const [email, setEmail] = useState('');

  const contextValue = {
    account2,
    setAccount2,
    socialLoginSDK,
    setSocialLoginSDK,
  };


  return (
    
    <AccountContext.Provider value={[account, setAccount]}>
    <BiconomyAccountContext.Provider value={{
      account, 
      setAccount, 
      socialLoginSDK, 
      setSocialLoginSDK,
      provider,
      setProvider,
      smartAccount,
      setSmartAccount,
      sureTokenContract,
      setSureTokenContract,
      sureTokenInterface,
      setSureTokenInterface,
      predictionWorldContract,
      setPredictionWorldContract,
      predictionWorldInterface,
      setPredictionWorldInterface,
      email,
      setEmail
    }}>
    <TestContext.Provider value={contextValue}>
      <Component {...pageProps} />
    </TestContext.Provider>
      
    </BiconomyAccountContext.Provider>
    </AccountContext.Provider>
   
  );
}
