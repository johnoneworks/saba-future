import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import styles from "./TestDataMark.module.scss";

export const TestDataMark = () => {
    const { t } = useTranslation();
    return (
        <div className={styles.chip}>
            <Chip
                icon={<LightbulbOutlinedIcon fontSize="small" />}
                label={t("test_data")}
                variant="outlined"
                size="small"
                color="error"
                sx={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "0 0 5px 0" }}
            />
        </div>
    );
};
