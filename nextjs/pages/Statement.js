import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { Statement } from "@/components/Statement/Statement";
import styles from "@/styles/Home.module.scss";
import { Box } from "@mui/material";

export default function StatementPage() {
    return (
        <Box className={styles.homeContainer}>
            <Header />
            <Box className={styles.homeContent}>
                <Statement />
            </Box>
            <Footer />
        </Box>
    );
}
