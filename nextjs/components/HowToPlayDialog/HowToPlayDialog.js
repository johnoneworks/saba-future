import { Dialog } from "@mui/material";
import Image from "next/image";
import PropTypes from "prop-types";
import styles from "./HowToPlayDialog.module.scss";

export default function HowToPlayDialog(props) {
    const { open, onClose } = props;

    const steps = [
        {
            title: "Sign In",
            description: "Sign in through Gmail or Facebook to start placing your bets and making predictions."
        },
        {
            title: "Choose Market",
            description: "Once logged in, click on any market to make predictions on current events."
        },
        {
            title: "Place Your Bet",
            description: "On the betting page, choose YES or NO and specify the amount you want to make your prediction."
        },
        {
            title: "Earn Prize",
            description: "If your bet matches the market outcome, you can earn the prize."
        }
    ];

    return (
        <>
            <Dialog onClose={() => onClose()} open={open} style={{ overflowY: "unset" }} PaperProps={{ sx: { overflowY: "unset" } }}>
                <div className={styles.dialogContainer}>
                    <div className={styles.introduce}>
                        <Image src="/howToPlay/orb-ball.svg" alt="SabaOrbIntroduce" width={92} height={92} />
                        <div className={styles.title}>What is Saba Orb?</div>
                        <div className={styles.description}>
                            Saba Orb is a thrilling prediction platform. Here, you can bet on various current events, and even craft your own questions to
                            challenge others. Through interaction and creativity, every prediction turns into an exciting adventure.
                        </div>
                    </div>
                    {steps.map((step, index) => (
                        <div className={styles.stepCard}>
                            <div className={styles.imageGroup}>
                                <div className={styles.stepNumber}>{index + 1}</div>
                                <Image src={`/howToPlay/stepof${index + 1}.png`} width={283} height={164} />
                            </div>
                            <div className={styles.stepExplain}>
                                <div className={styles.title}>{step.title}</div>
                                <div className={styles.description}>{step.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div onClick={() => onClose()} className={styles.closeHowToPlayButton}>
                    <Image src="/howToPlay/close.png" alt="closeHowToPlay" width={14} height={14} />
                </div>
            </Dialog>
        </>
    );
}

HowToPlayDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};
