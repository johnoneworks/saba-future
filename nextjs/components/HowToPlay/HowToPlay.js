import { Dialog } from "@mui/material";
import Image from "next/image";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import styles from "./HowToPlay.module.scss";

export default function HowToPlay({ onClose }) {
    const { t } = useTranslation();
    const steps = [
        {
            title: t("how_to_play_step_1_title"),
            description: t("how_to_play_step_1_description"),
            imageURL: "/howToPlay/step_1.png"
        },
        {
            title: t("how_to_play_step_2_title"),
            description: t("how_to_play_step_2_description"),
            imageURL: "/howToPlay/step_2.png"
        },
        {
            title: t("how_to_play_step_3_title"),
            description: t("how_to_play_step_3_description"),
            imageURL: "/howToPlay/step_3.png"
        },
        {
            title: t("how_to_play_step_4_title"),
            description: t("how_to_play_step_4_description"),
            imageURL: "/howToPlay/step_4.png"
        }
    ];

    return (
        <Dialog onClose={onClose} open PaperProps={{ sx: { overflowY: "unset" } }}>
            <div className={styles.dialogContainer}>
                <div className={styles.introduce}>
                    <Image src="/howToPlay/orb_ball.svg" alt="SabaOrbIntroduce" width={140} height={92} />
                    <div className={styles.title}>{t("how_to_play_introduce_title")}</div>
                    <div className={styles.description}>{t("how_to_play_introduce_description")}</div>
                </div>
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    return (
                        <div className={styles.stepCard} key={stepNumber}>
                            <div className={styles.imageGroup}>
                                <div className={styles.stepNumber}>{stepNumber}</div>
                                <Image src={step.imageURL} alt="stepImage" width={283} height={164} />
                            </div>
                            <div className={styles.stepExplain}>
                                <div className={styles.title}>{step.title}</div>
                                <div className={styles.description}>{step.description}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div onClick={onClose} className={styles.closeButton}>
                <Image src="/howToPlay/close.svg" alt="closeHowToPlay" width={14} height={14} />
            </div>
        </Dialog>
    );
}

HowToPlay.propTypes = {
    onClose: PropTypes.func.isRequired
};
