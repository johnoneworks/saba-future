import { BET_TYPE } from "@/constants/Constant";
import useGetBetsInfo from "@/hooks/useGetBetsInfo";
import useGetMarkets from "@/hooks/useGetMarkets";
import useGetUserBalance from "@/hooks/useGetUserBalance";
import syncPlaceBet from "@/service/ticket/placeBet";
import { useAccountStore } from "@/store/useAccountStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { useMenuStore } from "@/store/useMenuStore";
import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import classnames from "classnames";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./BetArea.module.scss";

const SelectButton = (props) => {
    const { type, selected, selectedAmount, totalAmount, onClick } = props;
    const buttonName = type;
    const buttonClass = `is${buttonName}`;
    const volumeWidth = totalAmount == 0 ? `50%` : `${(selectedAmount / totalAmount) * 100}%`;
    const { t } = useTranslation();

    return (
        <Box id={buttonName} className={classnames(styles.volumeButton, styles[buttonClass], { [styles.selected]: selected === type })} onClick={onClick}>
            <Typography sx={{ fontWeight: "bold", mr: "4px", zIndex: 1 }} variant="subtitle1" component="span">
                {t(buttonName.toLowerCase())}
            </Typography>
            <span style={{ display: "flex", flexDirection: "column", zIndex: 1 }}>
                <span className={classnames(styles.amount)}>{selectedAmount}</span>
                <span className={classnames(styles.amountUnit)}>{t("stake_unit")}</span>
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
    const { token, balance } = useAccountStore();

    const { updateBalance } = useGetUserBalance();
    const { updateBetsInfo } = useGetBetsInfo();
    const { updateMarkets } = useGetMarkets();

    const [selected, setSelected] = useState();
    const [stakeAmount, setStakeAmount] = useState("");
    const [isStakeValid, setIsStakeValid] = useState(false);

    const { t } = useTranslation();

    const handleTrade = async () => {
        try {
            setIsPageLoading(true);
            const response = await syncPlaceBet({
                marketId: id,
                betType: selected,
                stake: stakeAmount,
                token: token
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
            updateMarkets();
            updateBetsInfo(currentMarketID);
            setStakeAmount("");
            setIsPageLoading(false);
        }
    };

    const handleConfirmStake = (e) => {
        const stake = e.target.value;
        if (stake <= 0 || stake > balance || Math.floor(stake) != stake) {
            setIsStakeValid(false);
        } else setIsStakeValid(true);
        setStakeAmount(stake);
    };

    return (
        <Box className={styles.betArea}>
            <Typography variant="subtitle1" className={styles.title}>
                {t("buy")}
            </Typography>
            <hr className="text-black w-full py-2" />
            <Typography variant="body2" sx={{ width: "100%", mb: 1 }}>
                {t("pick_outcome")}
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
                {t("how_much")}
            </Typography>
            <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
                <TextField
                    className={classnames(styles.betInput)}
                    type="number"
                    name="q"
                    value={stakeAmount}
                    onChange={handleConfirmStake}
                    sx={{ width: "100%", pt: 0.5, pb: 2, color: "#4B5563", borderColor: "#D1D5DB", borderRadius: 1, "&:focus": { outline: "none" } }}
                    placeholder="0"
                    autoComplete="off"
                    min={0}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <span className={classnames(styles.amountUnit)}>{t("stake_unit")}</span>
                            </InputAdornment>
                        )
                    }}
                />
            </Box>
            <Button className={styles.betButton} onClick={handleTrade} disabled={!selected || !stakeAmount || !isStakeValid}>
                {t("trade")}
            </Button>
        </Box>
    );
};
