import { useMarketsStore } from "@/store/useMarketsStore";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import classnames from "classnames";
import { useEffect, useState } from "react";
import styles from "./ChartContainer.module.scss";

export default function ChartContainer() {
    const { yesInfo, noInfo } = useMarketsStore();

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
                                        <TableCell sx={{ width: "50%", textAlign: "center", fontSize: "12px", p: 0.5 }}>Time</TableCell>
                                        <TableCell sx={{ width: "50%", textAlign: "center", fontSize: "12px", p: 0.5 }}>Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {info.map((bet, i) => (
                                        <TableRow key={i}>
                                            <TableCell sx={{ width: "50%", textAlign: "center", borderBottom: "none" }}>{bet.time.toLocaleString()}</TableCell>
                                            <TableCell sx={{ width: "50%", textAlign: "center", borderBottom: "none" }}>{bet.amount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </ThemeProvider>
        );
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", position: "relative", width: "100%" }}>
            <InfoTable title={`Yes Info (${yesInfo.length})`} buttonStyle={classnames(styles.infoDropdown, styles.isYes)} info={yesInfo} />
            <InfoTable title={`No Info (${noInfo.length})`} buttonStyle={classnames(styles.infoDropdown, styles.isNo)} info={noInfo} />
        </Box>
    );
}
