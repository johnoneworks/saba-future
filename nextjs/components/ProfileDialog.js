import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonIcon from '@mui/icons-material/Person';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { blue, green } from '@mui/material/colors';
import PropTypes from 'prop-types';

export default function ProfileDialog(props) {

    const { onClose, open, smartAccount, email, balance } = props;

    const handleClose = () => {
        onClose();
    };

    const handleCopySmartContractWallet = () => {
        if (smartAccount?.address) {
            navigator.clipboard.writeText(smartAccount.address);
        }
    }

    return (

        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Profile</DialogTitle>
            <List>
                <ListItem>
                    <Grid container>
                        <Grid item xs={10} >
                            <Typography color="primary" variant="h3" align="center">
                                {balance}
                            </Typography>
                        </Grid>
                        <Grid item xs={2} display="flex" alignItems="end">
                            <Typography variant="overline">
                                Sure
                            </Typography>
                        </Grid>
                    </Grid>
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                            <PersonIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={email || smartAccount?.owner} />
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: green[100], color: green[600] }}>
                            <AccountBalanceWalletIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={smartAccount?.address} noWrap sx={{ overflow: "hidden", textOverflow: "ellipsis" }}/>
                    <IconButton onClick={handleCopySmartContractWallet}>
                        <ContentCopyIcon />
                    </IconButton>
                </ListItem>
            </List>
        </Dialog>
    );
}

ProfileDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    smartAccount: PropTypes.object.isRequired,
    email: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
};