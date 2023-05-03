import { useCallback } from "react";
import styles from "../styles/Home.module.css";

export default function SmartContractWallet() {
    const [account, setAccount] = useState("");

    const connectWeb3 = useCallback(async () => {
        if (typeof window === "undefined") return;
        
    });

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1>Biconomy Login</h1>
            </main>
        </div>
    );
}