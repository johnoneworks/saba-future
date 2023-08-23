import { TestDataMark } from "@/components/TestDataMark/TestDataMark";
import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { PageContext } from "@/contexts/PageContext";
import useGetMarketDetail from "@/hooks/useGetMarketDetail";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import BlockIcon from "@mui/icons-material/Block";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/system";
import classnames from "classnames";
import { useRouter } from "next/router";
import { useContext } from "react";
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
    const { currentMenu, setCurrentMarketID } = useContext(PageContext);
    const { account, predictionWorldContract, socialLoginSDK } = useContext(BiconomyAccountContext);
    const { updateMarketDetail } = useGetMarketDetail();

    let titleWidth = "w-[calc(100%-72px)]";
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
    if (win && lost) {
        titleWidth = "w-[calc(100%-168px)]";
    } else if (win || lost) {
        titleWidth = "w-[calc(100%-120px)]";
    }
    const outcomeValue = market.outcome ? "Yes" : "No";
    const winnersCount = market.outcome ? market.yesBets?.length : market.noBets?.length;
    const bonus = market.outcome
        ? market.totalYesAmount > 0
            ? `${Math.floor((market.totalNoAmount * 100) / market.totalYesAmount) - 1} %`
            : "-"
        : market.totalNoAmount > 0
        ? `${Math.floor((market.totalYesAmount * 100) / market.totalNoAmount) - 1} %`
        : "-";
    const cardValues = [
        {
            openTitle: "Yes",
            closeTitle: "Winners Count",
            openYesNoBgClass: "isYes",
            openOutcome: market.totalYesAmount.toString(),
            closeValue: winnersCount,
            YesNoColor: "#3FB06B",
            note: ""
        },
        {
            openTitle: "No",
            closeTitle: "Profit",
            openYesNoBgClass: "isNo",
            openOutcome: market.totalNoAmount.toString(),
            closeValue: bonus.toString(),
            YesNoColor: "#E84D4D",
            note: "possible fee included"
        }
    ];

    const handleLogin = async () => {
        if (!account && socialLoginSDK.web3auth.status !== "connected") {
            await socialLoginSDK.showWallet();
        }
    };

    const handleSelectMarket = () => {
        const marketID = `${market.id}`;
        router.push({
            pathname: `/`,
            query: { menu: currentMenu, marketid: marketID }
        });
        setCurrentMarketID(marketID);
        updateMarketDetail(marketID, predictionWorldContract);
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
        <Box sx={{ height: "100%" }} onClick={account ? handleSelectMarket : handleLogin}>
            <Box item xs={12} sm={6} md={4} className={classnames(styles.cardContainer, { [styles.isClosed]: isClosed })}>
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
                                    [styles.isYes]: market.outcome === true,
                                    [styles.isNo]: market.outcome === false
                                })}
                            >
                                {outcomeValue}
                            </Box>
                        )}
                    </Box>
                    {isEditable && (
                        <Tooltip title="Edit">
                            <IconButton className="float-right" color="primary" aria-label="go to edit" onClick={handleEdit} fontSize="small">
                                <BorderColorOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {!isClosed && market.endTimestamp < Date.now() && (
                        <Tooltip title="Time Over">
                            <IconButton className="float-right" color="warning" aria-label="go to edit" onClick={handleEdit} fontSize="small">
                                <AccessAlarmIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {!isClosed && market.isSuspended && (
                        <Tooltip title="Suspended">
                            <IconButton className="float-right" color="warning" aria-label="go to edit" onClick={handleEdit} fontSize="small">
                                <BlockIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
                {!isClosed && (
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: "bold", mr: "10px", color: "#585353" }}>
                            {market.totalAmount.toString()} <Typography variant="caption">SURE BET</Typography>
                        </Typography>
                    </Box>
                )}
                {win ? successIcon : null}
                {lost ? failIcon : null}
                <Box className={classnames(styles.valueContainer, { [styles.isClosed]: isClosed })}>
                    {cardValues.map((value, index) => {
                        return (
                            <Box key={index} className={classnames(styles.valueBox, { [styles[value.openYesNoBgClass]]: !isClosed })}>
                                {isClosed ? (
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
                                ) : (
                                    <Box className={styles.info}>
                                        <Typography variant="body1" sx={{ fontWeight: "bold", mr: "6px", color: value.YesNoColor }}>
                                            {value.openTitle}
                                        </Typography>
                                        <Box className={styles.sureGroup}>
                                            <Typography variant="filled" sx={{ fontWeight: "bold" }}>
                                                {value.openOutcome}
                                            </Typography>
                                            <CustomTypography variant="body2">SURE</CustomTypography>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
}
