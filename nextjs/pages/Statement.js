import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { Statement } from "@/components/Statement/Statement";
import styles from "@/styles/Home.module.scss";
import { Box } from "@mui/material";
import { useState } from "react";

export default function StatementPage() {
    const [refreshStatement, setRefreshStatement] = useState(true);
    return (
        <Box className={styles.homeContainer}>
            <Header refreshStatement={refreshStatement} setRefreshStatement={setRefreshStatement} />
            <Box className={styles.homeContent}>
                <Statement refreshStatement={refreshStatement} />
            </Box>
            <Footer />
        </Box>
    );
}
