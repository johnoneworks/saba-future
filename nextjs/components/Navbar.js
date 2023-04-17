import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from 'react';
import { ethers } from "ethers";
import { magic } from '../lib/magic';
import { UserContext } from '../lib/UserContext';

export default function Navbar() {
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [user, setUser] = useContext(UserContext);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (ethereum) {
      console.log(`Got the ethereum object: ${ethereum}`);
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        console.log(`Found authorized Account: ${accounts[0]}`);
        setAccount(accounts[0]);
      } else {
        console.log("No authorized account found");
      }
    } else {
      console.log("No Wallet found. Connect Wallet");
    }
  }

  const connectWallet = async () => {

    try {
      const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
      const accounts = await magic.wallet.connectWithUI();

      let userMetadata = await magic.user.getMetadata();
      await setUser(userMetadata);

      console.log('Found account', accounts);
      setAccount(accounts[0]);
    } catch (error) {
      alert('Error connecting to the wallet');
      console.log(`Error connecting to the wallet: ${error}`);
      console.error(error);
    }

    // try {
    //   const { ethereum } = window;

    //   if (!ethereum) {
    //     console.log('Metamask not detected');
    //     return;
    //   }
    //   let chainId = await ethereum.request({ method: 'eth_chainId' });
    //   console.log(`Connected to chain: ${chainId}`);

    //   const mumbaiChainId = '0x13881';

    //   const devChainId = 1337;
    //   const localhostChainId = `0x${Number(devChainId).toString(16)}`;

    //   await ethereum.request({
    //     method: 'wallet_switchEthereumChain',
    //     params: [{ chainId: mumbaiChainId }],
    //   });

    //   console.log(`Connected to chain: ${chainId}`);

    //   if (chainId !== mumbaiChainId && chainId !== localhostChainId) {
    //     alert('You are not connected to the Mumbai Testnet!');
    //     return;
    //   }

    //   const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

    //   console.log('Found account', accounts[0]);
    //   setCurrentAccount(accounts[0]);
    // } catch (error) {
    //   console.log(`Error connecting to metamask: ${error}`);
    // }
  }

  const showProfile = async () => {
    const walletInfo = await magic.wallet.getInfo();
    const walletType = walletInfo.walletType;
    if (walletType === "magic") {
      await magic.wallet.showUI();
    };
  }

  const logout = async () => {
    // Call Magic's logout method, reset the user state, and route to the login page
    magic.user.logout().then(() => {
      setUser(null);
      router.push('/');
    });
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  
  console.log('user');
  console.log(user);

  return (
    <>
      <nav className="w-full h-16 mt-auto max-w-5xl">
        <div className="flex flex-row justify-between items-center h-full">
          <Link href="/" passHref>
            <span className="font-semibold text-xl cursor-pointer">
              Prediction World
            </span>
          </Link>
          {!router.asPath.includes("/market") &&
            !router.asPath.includes("/admin") && (
              <div className="flex flex-row items-center justify-center h-full">
                <TabButton
                  title="Market"
                  isActive={router.asPath === "/"}
                  url={"/"}
                />
                <TabButton
                  title="Portfolio"
                  isActive={router.asPath === "/portfolio"}
                  url={"/portfolio"}
                />
              </div>
            )}

          {user ? (
            user.publicAddress ?
              <div className="flex flex-row">
                <div className="bg-green-500 px-6 py-2 rounded-md cursor-pointer mr-3" onClick={showProfile}>
                  <span className="text-lg text-white">
                    {user.publicAddress.substr(0, 10)}...
                  </span>
                </div>
                <div className="bg-green-500 px-6 py-2 rounded-md cursor-pointer" onClick={logout}>
                  <span className="text-lg text-white">
                    Logout
                  </span>
                </div>
              </div> :
              'Loading...'
          ) : (
              <div
                className="bg-green-500 px-6 py-2 rounded-md cursor-pointer"
                onClick={connectWallet} // original code is load all data
              >
                <span className="text-lg text-white">Connect</span>
              </div>
            )}
        </div>
      </nav>
    </>
  );
}

const TabButton = ({ title, isActive, url }) => {
  return (
    <Link href={url} passHref>
      <div
        className={`h-full px-4 flex items-center border-b-2 font-semibold hover:border-blue-700 hover:text-blue-700 cursor-pointer ${isActive
          ? "border-blue-700 text-blue-700 text-lg font-semibold"
          : "border-white text-gray-400 text-lg"
          }`}
      >
        <span>{title}</span>
      </div>
    </Link>
  );
};