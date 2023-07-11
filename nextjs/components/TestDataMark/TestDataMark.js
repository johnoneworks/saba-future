import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import Chip from "@mui/material/Chip";
import styles from "./TestDataMark.module.scss";

export const TestDataMark = () => {
    return (
        <div className={styles.chip}>
            <Chip
                icon={<LightbulbOutlinedIcon fontSize="small" />}
                label="Test Data"
                variant="outlined"
                size="small"
                color="error"
                sx={{ display: "flex", justifyContent: "center", width: "100px", alignItems: "center", margin: "0 0 5px 0" }}
            />
        </div>
    );
};
