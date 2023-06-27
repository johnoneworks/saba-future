import { Box, Skeleton } from "@mui/material";

export const LoadingSkeleton = () => {
    return (
        <Box sx={{ width: "100%", p: 1 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Skeleton variant="rectangular" sx={{ borderRadius: 1, mr: 1 }} width={50} height={50} />
                <Skeleton variant="text" sx={{ width: "80%" }} />
            </Box>
            <Skeleton variant="rectangular" sx={{ borderRadius: 1, mt: 1 }} height={100} />
        </Box>
    );
};
