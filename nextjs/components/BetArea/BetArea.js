import { predictionWorld3Address, sureToken3Address } from "@/config";
import { BET_TYPE, CONTRACTS_NAME } from "@/constants/Constant";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { LoadingContext } from "@/contexts/LoadingContext";
import useGetMarketDetail from "@/hooks/useGetMarketDetail";
import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import classnames from "classnames";
import { useContext, useState } from "react";
import styles from "./BetArea.module.scss";

const SelectButton = (props) => {
    const { type, selected, selectedAmount, totalAmount, onClick } = props;
    const buttonName = type;
    const totalAmountText = `${!totalAmount ? `0` : ((selectedAmount * 100) / totalAmount).toFixed(2)}%`;
    const selectedStyle = selected == type ? { backgroundColor: "#3FB06B", color: "white" } : { backgroundColor: "#F2F5FA" };
    const buttonClass = `is-${buttonName}`;

    return (
        <Box
            id={buttonName}
            style={selectedStyle}
            className={classnames(styles.volumeButton, { [styles[buttonClass]]: type === buttonName })}
            onClick={onClick}
        >
            <Typography sx={{ fontWeight: "bold", mr: "4px" }} variant="subtitle1" component="span">
                {buttonName}
            </Typography>
            <span style={{ fontWeight: "bold", color: "rgba(0, 0, 0, 0.65)" }}>{totalAmountText}</span>
        </Box>
    );
};

export const BetArea = (props) => {
    const { id, market } = props;
    const { smartAccount, predictionWorldInterface, sureTokenInterface } = useContext(BiconomyAccountContext);
    const { setIsPageLoading } = useContext(LoadingContext);
    const { updateMarketDetail } = useGetMarketDetail();
    const [selected, setSelected] = useState(BET_TYPE.YES);
    const [input, setInput] = useState("");

    const handleTrade = async () => {
        if (input === "") return;
        try {
            const betFunctionName = selected === BET_TYPE.YES ? CONTRACTS_NAME.ADD_YES_BET : CONTRACTS_NAME.ADD_NO_BET;

            try {
                setIsPageLoading(true);
                const approveEncodedData = sureTokenInterface.encodeFunctionData("approve", [predictionWorld3Address, input]);
                const addYesBetEncodedData = predictionWorldInterface.encodeFunctionData(betFunctionName, [id, input]);
                const transactions = [
                    {
                        to: sureToken3Address,
                        data: approveEncodedData,
                        gasLimit: 500000
                    },
                    {
                        to: predictionWorld3Address,
                        data: addYesBetEncodedData
                    }
                ];

                const txResponse = await smartAccount.sendTransactionBatch({ transactions });
                console.log("UserOp hash", txResponse.hash);
                const txReceipt = await txResponse.wait();
                console.log("Tx hash", txReceipt.transactionHash);
            } catch (error) {
                setIsPageLoading(false);
                console.error(`Error: ${error}`);
            }
        } catch (error) {
            setIsPageLoading(false);
            console.error(`Error trading: ${error}`);
        } finally {
            updateMarketDetail();
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
                        endAdornment: <InputAdornment position="end">SURE</InputAdornment>
                    }}
                />
            </Box>
            <Button className={styles.betButton} onClick={handleTrade}>
                Trade
            </Button>
        </Box>
    );
};
