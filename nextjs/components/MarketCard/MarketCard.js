import { PageContext } from "@/contexts/PageContext";
import useGetMarketDetail from "@/hooks/useGetMarketDetail";
import { Avatar, Box, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/system";
import classnames from "classnames";
import { useRouter } from "next/router";
import { useContext } from "react";
import styles from "./MarketCard.module.scss";

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
    "border-radius": "4px",
    "margin-right": "4px",
    width: "56px",
    height: "56px"
});

const CustomTypography = styled(Typography)({
    fontSize: "12px",
    fontWeight: "normal",
    transform: "scale(0.8)"
});

const CustomCardContent = styled(CardContent)({
    height: "136px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around"
});

export default function MarketCard({ id, title, outcome, yesBets, noBets, totalAmount, totalYesAmount, totalNoAmount, currentUser, isClosed }) {
    const router = useRouter();
    const { currentMenu, setCurrentMarketID } = useContext(PageContext);
    const { updateMarketDetail } = useGetMarketDetail();
    let titleWidth = "w-[calc(100%-72px)]";
    let win = false;
    let lost = false;
    if (yesBets?.filter((bet) => bet.user.toLowerCase() === currentUser?.toLowerCase()).length > 0) {
        if (outcome) {
            win = true;
        } else {
            lost = true;
        }
    }
    if (noBets?.filter((bet) => bet.user.toLowerCase() === currentUser?.toLowerCase()).length > 0) {
        if (outcome) {
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
    const outcomeValue = outcome ? "Yes" : "No";
    const winnersCount = outcome ? yesBets?.length : noBets?.length;
    const bonus = outcome ? totalYesAmount : totalNoAmount;
    const cardValueTitle = isClosed ? ["Outcome", "Winners Count", "Bonus"] : ["Volume", "Yes", "No"];
    const cardValues = [
        {
            title: cardValueTitle[0],
            openValueBgClass: "isVolume",
            isClosedOutcome: outcomeValue,
            openOutcome: totalAmount.toString(),
            openColor: "",
            isClosedcolor: "#E84D4D"
        },
        {
            title: cardValueTitle[1],
            openValueBgClass: "isYes",
            isClosedOutcome: winnersCount,
            openOutcome: totalYesAmount.toString(),
            openColor: "#3FB06B",
            isClosedcolor: ""
        },
        {
            title: cardValueTitle[2],
            openValueBgClass: "isNo",
            isClosedOutcome: bonus.toString(),
            openOutcome: totalNoAmount.toString(),
            openColor: "#E84D4D",
            isClosedcolor: ""
        }
    ];

    const handleSelectMarket = () => {
        const marketID = `${id}`;
        router.push({
            pathname: `/`,
            query: { menu: currentMenu, marketid: marketID }
        });
        setCurrentMarketID(marketID);
        updateMarketDetail(marketID);
    };

    return (
        <Box onClick={handleSelectMarket}>
            <Box item xs={12} sm={6} md={4} className={classnames(styles.cardContainer, { [styles.isClosed]: isClosed })}>
                <Box sx={{ display: "flex" }}>
                    <CustomAvatar>
                        <Box component="img" src="/placeholder.jpg" alt="placeholder" sx={{ width: "100%", height: "100%" }} />
                    </CustomAvatar>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", ml: "6px" }}>
                        {title}
                    </Typography>
                </Box>
                {win ? successIcon : null}
                {lost ? failIcon : null}
                <Box className={styles.valueContainer}>
                    {cardValues.map((value, index) => {
                        let displayElement;

                        if (index === 0) {
                            displayElement = (
                                <Box className={styles.info}>
                                    <Typography variant="body1" sx={{ fontWeight: "bold", mr: "6px" }}>
                                        {cardValueTitle[0]}
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: "bold", mr: "6px", color: "#E84D4D" }}>
                                        {outcomeValue}
                                    </Typography>
                                </Box>
                            );
                        } else if (index === 1) {
                            displayElement = (
                                <Box className={styles.info} sx={{ display: "flex", flexDirection: "column" }}>
                                    <Typography variant="filled">{value.isClosedOutcome}</Typography>
                                    <CustomTypography>{value.title}</CustomTypography>
                                </Box>
                            );
                        } else {
                            displayElement = (
                                <Box className={styles.info}>
                                    <Typography variant="body2" sx={{ fontWeight: "bold", mr: "6px" }}>
                                        {cardValueTitle[2]}
                                    </Typography>
                                    <Box className={styles.sureGroup}>
                                        <Typography variant="filled">{bonus.toString()}</Typography>
                                        <CustomTypography variant="body2">SURE</CustomTypography>
                                    </Box>
                                </Box>
                            );
                        }

                        return (
                            <Box key={index} className={classnames(styles.valueBox, { [styles[value.openValueBgClass]]: !isClosed })}>
                                {isClosed ? (
                                    <Box className={styles.info}>{displayElement}</Box>
                                ) : (
                                    <Box className={styles.info}>
                                        <Typography variant="body1" sx={{ fontWeight: "bold", mr: "6px", color: value.openColor }}>
                                            {value.title}
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
