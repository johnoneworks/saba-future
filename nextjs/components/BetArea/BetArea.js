import { BET_TYPE } from "@/constants/Constant";
import useGetBetsInfo from "@/hooks/useGetBetsInfo";
import useGetUserBalance from "@/hooks/useGetUserBalance";
import syncPlaceBet from "@/service/ticket/placeBet";
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
    const { id, yesAmount, noAmount, handleFetchMarketDetail } = props;
    const totalAmount = Number(yesAmount) + Number(noAmount);
    const { currentMarketID } = useMenuStore();
    const { setIsPageLoading } = useLoadingStore();

    const { updateBalance } = useGetUserBalance();
    const { updateBetsInfo } = useGetBetsInfo();

    const [selected, setSelected] = useState();
    const [stakeAmount, setStakeAmount] = useState("");

    const handleTrade = async () => {
        try {
            setIsPageLoading(true);
            const response = await syncPlaceBet({
                marketId: id,
                betType: selected,
                stake: stakeAmount
            });

            if (!!response && response.ErrorCode !== 0) {
                // TODO: 可能錢不夠的狀況，要顯示 Error.Msg
                console.error(error);
            }
        } catch (error) {
            setIsPageLoading(false);
            console.error(`Error trading: ${error}`);
        } finally {
            handleFetchMarketDetail(currentMarketID);
            updateBalance();
            updateBetsInfo(currentMarketID);
            setStakeAmount("");
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
                selectedAmount={yesAmount}
                totalAmount={totalAmount}
                onClick={() => setSelected(BET_TYPE.YES)}
            />
            <SelectButton type={BET_TYPE.NO} selected={selected} selectedAmount={noAmount} totalAmount={totalAmount} onClick={() => setSelected(BET_TYPE.NO)} />
            <Typography variant="body2" sx={{ m: 1, fontWeight: "bold", width: "100%" }}>
                How much?
            </Typography>
            <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
                <TextField
                    className={classnames(styles.betInput)}
                    type="number"
                    name="q"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
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
                />
            </Box>
            <Button className={styles.betButton} onClick={handleTrade} disabled={!selected || !stakeAmount}>
                Trade
            </Button>
        </Box>
    );
};
