import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

export const AdminConfirmPage = (props) => {
    const { onClose, open, onConfirm, selectedResolve } = props;

    const handleConfirm = () => {
        onConfirm();
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Confirm market result?</DialogTitle>

            <CardContent>
                <Typography sx={{ fontSize: 18, textAlign: "center" }} color="text.secondary" gutterBottom>
                    Your setting : {selectedResolve}
                </Typography>
            </CardContent>
            <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                <Button onClick={handleConfirm}> CONFIRM </Button>
                <Button onClick={handleClose} color="error">
                    CANCEL
                </Button>
            </CardActions>
        </Dialog>
    );
};
