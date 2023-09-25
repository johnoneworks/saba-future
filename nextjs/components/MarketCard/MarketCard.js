import { TestDataMark } from "@/components/TestDataMark/TestDataMark";
import useLogin from "@/hooks/useLogin";
import { useAccountStore } from "@/store/useAccountStore";
import { useMenuStore } from "@/store/useMenuStore";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import BlockIcon from "@mui/icons-material/Block";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/system";
import classnames from "classnames";
import moment from "moment";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import styles from "./MarketCard.module.scss";

/**
 * TODO:
 * 1. refactor
 *
 */

const failIcon = (
    <svg className="h-8 w-8 text-red-500" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" />
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);
const successIcon = (
    <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const CustomAvatar = styled(Avatar)({
    borderRadius: "4px",
    marginRight: "4px",
    width: "56px",
    height: "56px"
});

const CustomTypography = styled(Typography)({
    fontSize: "12px",
    fontWeight: "normal",
    transform: "scale(0.8)"
});

export default function MarketCard({ market, currentUser, isClosed, isTest, isEditable }) {
    const router = useRouter();
    const { currentMenu, setCurrentMarketID } = useMenuStore();
    const { nickName } = useAccountStore();
    const { redirectGoogleLogin } = useLogin();
    const { t } = useTranslation();

    let win = false;
    let lost = false;
    if (market.yesBets?.filter((bet) => bet.user.toLowerCase() === currentUser?.toLowerCase()).length > 0) {
        if (market.outcome) {
            win = true;
        } else {
            lost = true;
        }
    }
    if (market.noBets?.filter((bet) => bet.user.toLowerCase() === currentUser?.toLowerCase()).length > 0) {
        if (market.outcome) {
            lost = true;
        } else {
            win = true;
        }
    }

    const outcomeValue = market.outcome ? t("yes") : t("no");
    const yesAmount = parseFloat(market.totalYesAmount.toString());
    const noAmount = parseFloat(market.totalNoAmount.toString());
    const totalAmount = parseFloat(market.totalAmount.toString());
    const cardValues = [
        {
            openTitle: t("no"),
            closeTitle: t("card_winners_count"),
            openYesNoBgClass: "isNo",
            openOutcome: noAmount,
            closeValue: market.winnerCount,
            YesNoColor: "#E84D4D",
            note: ""
        },
        {
            openTitle: t("yes"),
            closeTitle: t("card_profit"),
            openYesNoBgClass: "isYes",
            openOutcome: yesAmount,
            closeValue: market.winnerProfit,
            YesNoColor: "#3FB06B",
            note: t("possible_fee")
        }
    ];

    const getPercentage = (targetAmount) => {
        const result = totalAmount == 0 ? `50%` : `${(targetAmount / totalAmount) * 100}%`;
        return result;
    };

    const handleLogin = async () => {
        redirectGoogleLogin();
    };

    const handleSelectMarket = () => {
        const marketID = `${market.id}`;
        router.push({
            pathname: `/`,
            query: { menu: currentMenu, marketid: marketID }
        });
        setCurrentMarketID(marketID);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        const marketID = `${market.id}`;
        router.push({
            pathname: `/admin/${marketID}`
        });
        return false;
    };

    return (
        <Box sx={{ height: "100%" }} onClick={nickName ? handleSelectMarket : handleLogin}>
            <Box xs={12} sm={6} md={4} className={classnames(styles.cardContainer, { [styles.isClosed]: isClosed })}>
                {isTest && <TestDataMark />}
                <Box sx={{ display: "flex" }}>
                    <CustomAvatar>
                        <Box component="img" src={market.imageHash} alt="marketImage" sx={{ width: "100%", height: "100%" }} />
                    </CustomAvatar>
                    <Box ml={1}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "bolder" }}>
                            {market.question}
                        </Typography>
                        {isClosed && (
                            <Box
                                className={classnames(styles.outcome, {
                                    [styles.isYes]: market.outcome,
                                    [styles.isNo]: !market.outcome
                                })}
                            >
                                {outcomeValue}
                            </Box>
                        )}
                    </Box>
                    {isEditable && (
                        <Tooltip title={t("edit")}>
                            <IconButton className="float-right" color="primary" aria-label="go to edit" onClick={handleEdit} fontSize="small">
                                <BorderColorOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {!isClosed && moment(market.endTimestamp) < moment(Date.now()) && (
                        <Tooltip title={t("time_over")}>
                            <IconButton className="float-right" color="warning" aria-label="go to edit" onClick={handleEdit} fontSize="small">
                                <AccessAlarmIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {!isClosed && market.isSuspended && (
                        <Tooltip title={t("suspended")}>
                            <IconButton className="float-right" color="warning" aria-label="go to edit" onClick={handleEdit} fontSize="small">
                                <BlockIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
                {!isClosed && (
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: "bold", mr: "10px", color: "#585353" }}>
                            {totalAmount} <Typography variant="caption">{t("stake_unit")}</Typography>
                        </Typography>
                    </Box>
                )}
                {win ? successIcon : null}
                {lost ? failIcon : null}
                <Box className={classnames(styles.valueContainer, { [styles.isClosed]: isClosed })}>
                    {cardValues.map((value, index) => {
                        const currentAmount = value.openYesNoBgClass === `isYes` ? yesAmount : noAmount;
                        return (
                            <Fragment key={`cardValue_${index}`}>
                                {isClosed ? (
                                    <Box key={index} sx={{ width: "50%" }} className={classnames(styles.valueBox)}>
                                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                            <Box className={styles.info}>
                                                <Typography variant="body1" sx={{ fontWeight: "bold", mr: "10px", color: "#585353" }}>
                                                    {value.closeTitle}
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontWeight: "bold", color: "#585353" }}>
                                                    {value.closeValue}
                                                </Typography>
                                            </Box>
                                            <Typography variant="caption" color="#A0A4A8">
                                                {value.note}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box
                                        key={index}
                                        sx={{ width: getPercentage(currentAmount) }}
                                        className={classnames(styles.valueBox, styles[value.openYesNoBgClass])}
                                    >
                                        <Box className={styles.info}>
                                            <Typography variant="body1" sx={{ fontWeight: "bold", mr: "6px", color: value.YesNoColor }}>
                                                {value.openTitle}
                                            </Typography>
                                            <Box className={styles.unitGroup}>
                                                <Typography variant="filled" sx={{ fontWeight: "bold" }}>
                                                    {value.openOutcome}
                                                </Typography>
                                                <CustomTypography variant="body2">{t("stake_unit")}</CustomTypography>
                                            </Box>
                                        </Box>
                                    </Box>
                                )}
                            </Fragment>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
}
