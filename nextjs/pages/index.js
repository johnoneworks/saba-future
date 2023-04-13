import { useState, useEffect } from "react";

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (ethereum) {
      console.log(`Got the ethereum object: ${ethereum}`);
    } else {
      console.log("No Wallet found. Connect Wallet");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      console.log(`Found authorized Account: ${accounts[0]}`);
      setCurrentAccount(accounts[0]);
    } else {
      console.log("No authorized account found");
    }
  }

  const connectWallet = async () => {
		try {
			const { ethereum } = window;

			if (!ethereum) {
				console.log('Metamask not detected');
				return;
			}
			let chainId = await ethereum.request({ method: 'eth_chainId' });
			console.log(`Connected to chain: ${chainId}`);

			const mumbaiChainId = '0x13881';

			const devChainId = 1337;
			const localhostChainId = `0x${Number(devChainId).toString(16)}`;

      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: mumbaiChainId }],
      });

      console.log(`Connected to chain: ${chainId}`);

			if (chainId !== mumbaiChainId && chainId !== localhostChainId) {
				alert('You are not connected to the Mumbai Testnet!');
				return
			}

			const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

			console.log('Found account', accounts[0]);
			setCurrentAccount(accounts[0])
		} catch (error) {
			console.log(`Error connecting to metamask: ${error}`);
		}
	}

  return (
    <div className='flex flex-col items-center pt-32 bg-[#0B132B] text-[#d3d3d3] min-h-screen'>
      <div className='trasition hover:rotate-180 hover:scale-105 transition duration-500 ease-in-out'>
        <svg
					xmlns='http://www.w3.org/2000/svg'
					width='60'
					height='60'
					fill='currentColor'
					viewBox='0 0 16 16'
				>
          <path d='M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z' />
        </svg>
      </div>
      <h2 className='text-3xl font-bold mb-20 mt-12'>
        Prediction World!
      </h2>
      {currentAccount === "" ? (
        <button
          className='text-2xl font-bold py-3 px-12 bg-black shadow-lg shadow-[#6FFFE9] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : (
        <>valid account</>
      )}
    </div>
	);
}
