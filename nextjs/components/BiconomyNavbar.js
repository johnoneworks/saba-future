import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";

export default function BiconomyNavbar() {
    const router = useRouter();
    const [account, setAccount] = useContext(BiconomyAccountContext);

    const checkIfWalletIsConnected = async () => {
        await setAccount("something");
      }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);
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

                    {account ? (
                                <div className="bg-green-500 px-6 py-2 rounded-md cursor-pointer">
                                <span className="text-lg text-white">
                                    {account.substr(0, 10)}...
                                </span>
                                </div>
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