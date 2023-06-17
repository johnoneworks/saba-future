import { Avatar, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/system";
import Image from "next/image";
import Link from "next/link";

const CardContainer = styled("div")({
    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.15)",
    borderRadius: "8px",
    margin: "4px",
    cursor: "pointer",
    "&:hover": {
        borderColor: "#0070f3"
    }
});

const CardTop = styled("div")({
    display: "flex"
});

const TypographyGroup = styled("div")({
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
});

const CustomAvatar = styled(Avatar)({
    "border-radius": "4px",
    "margin-right": "4px"
});

const Title = styled("div")({
    fontSize: "14px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginBottom: "8px"
});

const InfoText = styled("div")({
    marginRight: "6px",
    fontSize: "12px",
    color: "#777"
});

const ValueContainer = styled("div")({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "6px"
});

const ValueBox = styled("div")({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "border-radius": "4px"
});

const Info = styled("div")({
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    color: "rgba(0, 0, 0, 0.65)",
    fontWeight: "bold",
    lineHeight: 1,
    borderRadius: "4px",
    padding: "2px 4px"
});

const isVolume = {
    width: "38%",
    backgroundColor: "#F2F5FA"
};

const isYes = {
    width: "29%",
    backgroundColor: "#E9F6EE"
};

const isNo = {
    width: "29%",
    backgroundColor: "#FDEDED"
};

const CustomTypography = styled("div")({
    fontSize: "12px",
    fontWeight: "normal",
    transform: "scale(0.8)"
});

const SureText = styled(Typography)({
    fontSize: "12px",
    color: "#0070f3"
});

export default function MarketCard({ id, title, outcome, yesBets, noBets, totalAmount, totalYesAmount, totalNoAmount, currentUser, isClosed }) {
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

    return (
        <div className="w-full overflow-hidden">
            <Link href={`/market/${id}`} passHref>
                <CardContainer>
                    <CardContent>
                        <CardTop>
                            <CustomAvatar>
                                <Image src="/placeholder.jpg" alt="placeholder" width={100} height={100} />
                            </CustomAvatar>
                            <Title>{title}</Title>
                        </CardTop>
                        {win ? successIcon : null}
                        {lost ? failIcon : null}
                        <ValueContainer>
                            <ValueBox style={isVolume}>
                                {isClosed ? (
                                    <Info>
                                        <InfoText>{cardValueTitle[0]}</InfoText>
                                        <Typography variant="filled">{outcomeValue}</Typography>
                                    </Info>
                                ) : (
                                    <Info>
                                        <InfoText>{cardValueTitle[0]}</InfoText>
                                        <TypographyGroup>
                                            <Typography variant="filled">{totalAmount.toString()}</Typography>
                                            <CustomTypography variant="body2">SURE</CustomTypography>
                                        </TypographyGroup>
                                    </Info>
                                )}
                            </ValueBox>
                            <ValueBox style={isYes}>
                                {isClosed ? (
                                    <Info>
                                        <InfoText>{cardValueTitle[1]}</InfoText>
                                        <Typography variant="filled">{winnersCount}</Typography>
                                    </Info>
                                ) : (
                                    <Info>
                                        <InfoText>{cardValueTitle[1]}</InfoText>
                                        <TypographyGroup>
                                            <Typography variant="filled">{totalYesAmount.toString()}</Typography>
                                            <CustomTypography variant="body2">SURE</CustomTypography>
                                        </TypographyGroup>
                                    </Info>
                                )}
                            </ValueBox>
                            <ValueBox style={isNo}>
                                {isClosed ? (
                                    <Info>
                                        <InfoText>{cardValueTitle[2]}</InfoText>
                                        <Typography variant="filled">{bonus.toString()}</Typography>
                                        <CustomTypography variant="body2">SURE</CustomTypography>
                                    </Info>
                                ) : (
                                    <Info>
                                        <InfoText>{cardValueTitle[2]}</InfoText>
                                        <TypographyGroup>
                                            <Typography variant="filled">{totalNoAmount.toString()}</Typography>
                                            <CustomTypography variant="body2">SURE</CustomTypography>
                                        </TypographyGroup>
                                    </Info>
                                )}
                            </ValueBox>
                        </ValueContainer>
                    </CardContent>
                </CardContainer>
            </Link>
        </div>
    );
}
