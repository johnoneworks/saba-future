import { predictionWorldAddress, sureTokenAddress } from "@/config";
import { BET_TYPE, CONTRACTS_NAME } from "@/constants/Constant";
import useGetBetsInfo from "@/hooks/useGetBetsInfo";
import { useGetMarketDetail } from "@/hooks/useGetMarketDetail";
import useGetUserBalance from "@/hooks/useGetUserBalance";
import useGetUserStatement from "@/hooks/useGetUserStatement";
import { useAccountStore } from "@/store/useAccountStore";
import { useContractStore } from "@/store/useContractStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { useMenuStore } from "@/store/useMenuStore";
import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import classnames from "classnames";
import { useState } from "react";
import styles from "./BetArea.module.scss";

const SelectButton = (props) => {
    const { type, selected, selectedAmount, totalAmount, onClick } = props;
    const buttonName = type;
    const buttonClass = `is${buttonName}`;
    const volumeWidth = totalAmount == 0 ? `50%` : `${(selectedAmount / totalAmount) * 100}%`;

    return (
        <Box id={buttonName} className={classnames(styles.volumeButton, styles[buttonClass], { [styles.selected]: selected === type })} onClick={onClick}>
            <Typography sx={{ fontWeight: "bold", mr: "4px", zIndex: 1 }} variant="subtitle1" component="span">
                {buttonName}
            </Typography>
            <span style={{ display: "flex", flexDirection: "column", zIndex: 1 }}>
                <span className={classnames(styles.amount)}>{selectedAmount}</span>
                <span className={classnames(styles.amountUnit)}>SURE</span>
            </span>
            <div className={classnames(styles.volume, styles[buttonClass], { [styles.selected]: selected === type })} style={{ width: volumeWidth }}></div>
        </Box>
    );
};

export const BetArea = (props) => {
    const { id, market } = props;
    const { smartAccount } = useAccountStore();
    const { predictionWorldInterface, sureTokenInterface, predictionWorldContract } = useContractStore();
    const { updateMarketDetail } = useGetMarketDetail();
    const { currentMarketID } = useMenuStore();
    const { setIsPageLoading } = useLoadingStore();

    const { updateBalance } = useGetUserBalance();
    const { updateBetsInfo } = useGetBetsInfo();
    const { updateStatements } = useGetUserStatement();

    const [selected, setSelected] = useState();
    const [input, setInput] = useState("");

    const handleTrade = async () => {
        if (input === "") return;
        try {
            const betFunctionName = selected === BET_TYPE.YES ? CONTRACTS_NAME.ADD_YES_BET : CONTRACTS_NAME.ADD_NO_BET;

            try {
                setIsPageLoading(true);
                const approveEncodedData = sureTokenInterface.encodeFunctionData("approve", [predictionWorldAddress, input]);
                const addYesBetEncodedData = predictionWorldInterface.encodeFunctionData(betFunctionName, [id, input]);
                const transactions = [
                    {
                        to: sureTokenAddress,
                        data: approveEncodedData,
                        gasLimit: 500000
                    },
                    {
                        to: predictionWorldAddress,
                        data: addYesBetEncodedData
                    }
                ];

                const txResponse = await smartAccount.sendTransactionBatch({ transactions });
                console.log("UserOp hash", txResponse.hash);
                const txReceipt = await txResponse.wait();
                console.log("Tx hash", txReceipt.transactionHash);
            } catch (error) {
                setIsPageLoading(false);
                console.error(error);
            }
        } catch (error) {
            setIsPageLoading(false);
            console.error(`Error trading: ${error}`);
        } finally {
            updateMarketDetail(currentMarketID, predictionWorldContract);
            updateBalance();
            updateStatements();
            updateBetsInfo(currentMarketID, predictionWorldContract);
            setInput("");
            setIsPageLoading(false);
        }
    };

    return (
        <Box className={styles.betArea}>
            <Typography variant="subtitle1" className={styles.title}>
                Buy
            </Typography>
            <hr className="text-black w-full py-2" />
            <Typography variant="body2" sx={{ width: "100%", mb: 1 }}>
                Pick Outcome
            </Typography>
            <SelectButton
                type={BET_TYPE.YES}
                selected={selected}
                selectedAmount={market?.totalYesAmount}
                totalAmount={market?.totalAmount}
                onClick={() => setSelected(BET_TYPE.YES)}
            />
            <SelectButton
                type={BET_TYPE.NO}
                selected={selected}
                selectedAmount={market?.totalNoAmount}
                totalAmount={market?.totalAmount}
                onClick={() => setSelected(BET_TYPE.NO)}
            />
            <Typography variant="body2" sx={{ m: 1, fontWeight: "bold", width: "100%" }}>
                How much?
            </Typography>
            <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
                <TextField
                    type="number"
                    name="q"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    sx={{ width: "100%", pt: 0.5, pb: 2, color: "#4B5563", borderColor: "#D1D5DB", borderRadius: 1, "&:focus": { outline: "none" } }}
                    placeholder="0"
                    autoComplete="off"
                    min={0}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <span className={classnames(styles.amountUnit)}>SURE</span>
                            </InputAdornment>
                        )
                    }}
                    className={classnames(styles.betInput)}
                />
            </Box>
            <Button className={styles.betButton} onClick={handleTrade} disabled={!selected || !input}>
                Trade
            </Button>
        </Box>
    );
};
