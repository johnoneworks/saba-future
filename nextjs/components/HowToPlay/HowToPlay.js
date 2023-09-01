import { Dialog } from "@mui/material";
import Image from "next/image";
import PropTypes from "prop-types";
import styles from "./HowToPlay.module.scss";

export default function HowToPlay({ onClose }) {
    const steps = [
        {
            title: "Sign In",
            description: "Sign in through Gmail or Facebook to start placing your bets and making predictions.",
            imageURL: "/howToPlay/step_1.png"
        },
        {
            title: "Choose Market",
            description: "Once logged in, click on any market to make predictions on current events.",
            imageURL: "/howToPlay/step_2.png"
        },
        {
            title: "Place Your Bet",
            description: "On the betting page, choose YES or NO and specify the amount you want to make your prediction.",
            imageURL: "/howToPlay/step_3.png"
        },
        {
            title: "Earn Prize",
            description: "If your bet matches the market outcome, you can earn the prize.",
            imageURL: "/howToPlay/step_4.png"
        }
    ];

    return (
        <Dialog onClose={onClose} open PaperProps={{ sx: { overflowY: "unset" } }}>
            <div className={styles.dialogContainer}>
                <div className={styles.introduce}>
                    <Image src="/howToPlay/orb_ball.svg" alt="SabaOrbIntroduce" width={140} height={92} />
                    <div className={styles.title}>What is Saba Orb?</div>
                    <div className={styles.description}>
                        Saba Orb is a thrilling prediction platform. Here, you can bet on various current events, and even craft your own questions to challenge
                        others. Through interaction and creativity, every prediction turns into an exciting adventure.
                    </div>
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
