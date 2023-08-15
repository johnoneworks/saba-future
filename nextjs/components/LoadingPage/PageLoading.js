import { useLoadingStore } from "@/store/useLoadingStore";
import { Box, CircularProgress, Fade } from "@mui/material";

export default function PageLoading() {
    const { isPageLoading } = useLoadingStore();
    return (
        <Fade in={isPageLoading}>
            <Box
                sx={{
                    position: "fixed",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                    bgcolor: "rgba(32, 32, 32, 0.5)"
                }}
            >
                <CircularProgress color="primary" size={70} thickness={4} sx={{ borderRadius: "4px" }} />
            </Box>
        </Fade>
    );
}
