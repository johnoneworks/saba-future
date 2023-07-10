import ContentPasteOffIcon from "@mui/icons-material/ContentPasteOff";
import { Box, Typography } from "@mui/material";

export const EmptyPage = () => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
            <ContentPasteOffIcon sx={{ margin: 1, mt: 2, fontSize: 50, color: "#1A84F2" }} />
            <Typography sx={{ color: "#1A84F2" }}>No Data Found</Typography>
        </Box>
    );
};
