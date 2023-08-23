import { Box, Divider, Grid, Typography } from "@mui/material";
import styles from "./Footer.module.scss";

export const Footer = () => {
    return (
        <Grid container direction="column" alignItems="center" spacing={1.5} sx={{ backgroundColor: "#1A84F2", color: "white", p: 1 }}>
            <Grid className={styles.footer} item>
                <Box className={styles.logo}>
                    <img src="/logo.svg" alt="placeholder" width={70} height={70} />
                </Box>
                <Box className={styles.info}>
                    <Typography variant="overline">Powered by</Typography>
                    <a href="https://polygon.technology/" target="_blank" rel="noopener noreferrer">
                        <img src="/polygon.png" alt="placeholder" width={80} height={24} />
                    </a>
                </Box>
            </Grid>
            <Grid item sx={{ width: "100%" }}>
                <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(256, 256, 256, 0.4)", borderWidth: 1 }} />
            </Grid>
            <Grid item sx={{ display: "flex", justifyContent: "center", alignItems: "center", opacity: 0.6 }}>
                <Typography variant="overline">© 2023 Saba Orb, All right reserved.</Typography>
            </Grid>
        </Grid>
    );
};
