import { BiconomyAccountContext } from "@/contexts/BiconomyAccountContext";
import { UserInfoContext } from "@/contexts/UserInfoContext";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { useContext, useEffect, useState } from "react";

/**
 * TODO:
 * 1. 應為統一樣式，不只為新user時使用
 * 2. 新功能: 按鍵領取免費 sure
 * 3. 樣式調整
 */

export const NewbieDialog = () => {
    const { balance, userStatements } = useContext(UserInfoContext);
    const { account } = useContext(BiconomyAccountContext);
    const [isNewbie, setIsNewbie] = useState(false);

    useEffect(() => {
        if (account && balance === 0 && userStatements?.length === 0) {
            setIsNewbie(true);
        }
    }, [account, balance, userStatements]);

    return (
        <Dialog sx={{ textAlign: "center" }} onClose={() => setIsNewbie(false)} open={isNewbie}>
            <DialogTitle sx={{ color: "#1A84F2" }}>Welcome to Saba Future</DialogTitle>
            <CardContent>
                <Typography sx={{ fontSize: 18, textAlign: "center" }} gutterBottom>
                    You can get <span style={{ color: "#E84D4D" }}>1000 sure</span> after your first bet!
                </Typography>
            </CardContent>
            <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                <Button onClick={() => setIsNewbie(false)}> Check it </Button>
            </CardActions>
        </Dialog>
    );
};
