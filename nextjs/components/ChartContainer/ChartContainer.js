import useGetBetsInfo from "@/hooks/useGetBetsInfo";
import { useAccountStore } from "@/store/useAccountStore";
import { useMarketsStore } from "@/store/useMarketsStore";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import classnames from "classnames";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./ChartContainer.module.scss";

export default function ChartContainer() {
    const { updateBetsInfo } = useGetBetsInfo();
    const { nickName } = useAccountStore();
    const { yesInfo, noInfo } = useMarketsStore();
    const { t } = useTranslation();

    const InfoTable = ({ info, title, buttonStyle }) => {
        const theme = createTheme();
        const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
        const [isOpen, setIsOpen] = useState(isDesktop);

        useEffect(() => {
            setIsOpen(isDesktop);
        }, [isDesktop]);

        const handleClick = () => {
            setIsOpen(!isOpen);
        };

        return (
            <ThemeProvider theme={theme}>
                <Box className={styles.infoDropdownContainer}>
                    <Button className={[buttonStyle, classnames({ [styles.isOpen]: isOpen })].join(" ")} onClick={handleClick}>
                        {title}
                        <ExpandMoreIcon className={styles.arrowIcon} />
                    </Button>
                    {isOpen && (
                        <TableContainer className={styles.tableContainer}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ width: "50%", textAlign: "center", fontSize: "12px", p: 0.5 }}>{t("chart_time")}</TableCell>
                                        <TableCell sx={{ width: "33%", textAlign: "center", fontSize: "12px", p: 0.5 }}>{t("name")}</TableCell>
                                        <TableCell sx={{ width: "50%", textAlign: "center", fontSize: "12px", p: 0.5 }}>{t("chart_amount")}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {info.map((bet, i) => {
                                        const isUserBet = bet.nickName === nickName;
                                        return (
                                            <TableRow key={i} sx={{ backgroundColor: isUserBet ? "#ffffc7e0" : "#fff" }}>
                                                <TableCell sx={{ width: "33%", textAlign: "center", borderBottom: "none" }}>
                                                    {bet.time.toLocaleString()}
                                                </TableCell>
                                                <TableCell sx={{ width: "33%", textAlign: "center", borderBottom: "none" }}>{bet.nickName}</TableCell>
                                                <TableCell sx={{ width: "33%", textAlign: "center", borderBottom: "none" }}>{bet.amount}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </ThemeProvider>
        );
    };

    useEffect(() => {
        updateBetsInfo();
    }, []);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", position: "relative", width: "100%" }}>
            <InfoTable title={`${t("yes_info")} (${yesInfo.length})`} buttonStyle={classnames(styles.infoDropdown, styles.isYes)} info={yesInfo} />
            <InfoTable title={`${t("no_info")} (${noInfo.length})`} buttonStyle={classnames(styles.infoDropdown, styles.isNo)} info={noInfo} />
        </Box>
    );
}
