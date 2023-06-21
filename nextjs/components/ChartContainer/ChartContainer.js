import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import classnames from "classnames";
import { useCallback, useContext, useEffect, useState } from "react";
import styles from "./ChartContainer.module.scss";

export default function ChartContainer({ questionId}) {
    const [yesInfo, setYesInfo] = useState([]);
    const [noInfo, setNoInfo] = useState([]);
    const { account, predictionWorldContract } = useContext(BiconomyAccountContext);

    const getBets = useCallback(
        async (questionId, predictionWorldContract) => {
            try {
                let bets = await predictionWorldContract.getBets(Number(questionId));
                let yesBets = [];
                let noBets = [];
                // yes bets
                bets["0"].forEach((bet) => {
                    yesBets.push({
                        time: new Date(parseInt(bet.timestamp + "000")),
                        amount: bet.amount.toNumber()
                    });
                });
                setYesInfo(yesBets);
                // no bets
                bets["1"].forEach((bet) => {
                    noBets.push({
                        time: new Date(parseInt(bet.timestamp + "000")),
                        amount: bet.amount.toNumber()
                    });
                });
                setNoInfo(noBets);
            } catch (error) {
                console.error(`Error getting bets, ${error}`);
            }
        },
        [questionId, predictionWorldContract]
    );

    useEffect(() => {
        if (questionId && predictionWorldContract) {
            getBets(questionId, predictionWorldContract);
        }
    }, [questionId, account, getBets]);

    function InfoTable({ info, title, buttonStyle }) {
        const [isOpen, setIsOpen] = useState(false);

        const handleClick = () => {
            setIsOpen(!isOpen);
        };

        return (
            <Box sx={{ marginBottom: "20px" }}>
                <Button className={[buttonStyle, classnames({ [styles.isOpen]: isOpen })].join(' ')} onClick={handleClick}>
                    {title}
                    <ExpandMoreIcon />
                </Button>
                {isOpen && (
                    <TableContainer className={styles.tableContainer}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: "50%", textAlign: "center",fontSize: "12px", p: 0.5 }}>Time</TableCell>
                                    <TableCell sx={{ width: "50%", textAlign: "center",fontSize: "12px", p: 0.5 }}>Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {info.map((bet, i) => (
                                    <TableRow key={i}>
                                        <TableCell sx={{ width: "50%", textAlign: "center", borderBottom:"none" }}>{bet.time.toLocaleString()}</TableCell>
                                        <TableCell sx={{ width: "50%", textAlign: "center", borderBottom:"none" }}>{bet.amount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", position: "relative" }}>
            <InfoTable title="Yes Info" buttonStyle={classnames(styles.infoDropdown, styles.isYes)} info={yesInfo} />
            <InfoTable title="No Info" buttonStyle={classnames(styles.infoDropdown, styles.isNo)} info={noInfo} />
        </Box>
    );
}
