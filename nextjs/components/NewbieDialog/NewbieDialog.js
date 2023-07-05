import { earlyBirdAddress, sureTokenAddress } from "@/config";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { UserInfoContext } from "@/contexts/UserInfoContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useContext, useEffect, useState } from "react";
import styles from "./NewbieDialog.module.scss";

/**
 * TODO:
 * 1. 應為統一樣式，不只為新user時使用
 * 2. 新功能: 按鍵領取免費 sure
 * 3. 樣式調整
 */

export const NewbieDialog = () => {
    const { balance, userStatements, hasGetFirstData } = useContext(UserInfoContext);
    const { account, smartAccount, earlyBirdValidState, earlyBirdInterface } = useContext(BiconomyAccountContext);
    const [isLoading, setIsLoading] = useState(false);
    const [isNewbie, setIsNewbie] = useState(false);
    const [hasShow, setHasShow] = useState(false);

    useEffect(() => {
        if (account && balance == 0 && hasGetFirstData && userStatements.length == 0 && !hasShow && earlyBirdValidState === 1) {
            setIsNewbie(true);
            setHasShow(true);
        }
    }, [account, balance, userStatements, hasGetFirstData, earlyBirdValidState]);

    const handleSnapUpEarlyBird = async () => {
        try {
            setIsLoading(true);
            await snapUpEarlyBird();
            alert("Success!");
        } catch (err) {
            console.error(err);
            alert("Error!!");
        } finally {
            setIsLoading(false);
            setIsNewbie(false);
        }
    }

    const snapUpEarlyBird = async () => {
        let transactions = [];
        const transactionData = earlyBirdInterface.encodeFunctionData("snapUp", [sureTokenAddress]);

        transactions = [
            {
                to: earlyBirdAddress,
                data: transactionData
            }
        ];

        const txResponse = await smartAccount.sendTransactionBatch({ transactions });
        console.log("UserOp hash", txResponse.hash);
        const txReceipt = await txResponse.wait();
        console.log("Tx hash", txReceipt.transactionHash);
    }

    return (
        <Dialog sx={{ textAlign: "center" }} onClose={() => setIsNewbie(false)} open={isNewbie}>
            <Paper className={styles.dialog}>
                <DialogTitle sx={{ fontSize: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ width: "10px", height: "1px", backgroundColor: "#fff", marginRight: "4px" }}></span>
                        <span style={{ color: "#fff" }}>Welcome to SaBa Future</span>
                        <span style={{ width: "10px", height: "1px", backgroundColor: "#fff", marginLeft: "4px" }}></span>
                    </div>
                </DialogTitle>
                <Box
                    sx={{
                        color: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                >
                    <CardContent>
                        <Typography sx={{ fontSize: 20 }} gutterBottom>
                            First 100 users can get <div style={{ fontWeight: "bold", fontSize: 30 }}>1000</div> free SURE tokens!
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button onClick={handleSnapUpEarlyBird} className={styles.btn} disabled={isLoading}>
                            Snap Up
                        </Button>
                        <Button onClick={() => setIsNewbie(false)} className={styles.btn} disabled={isLoading}>
                            Give Up
                        </Button>
                    </CardActions>
                </Box>
            </Paper>
        </Dialog>
    );
};
