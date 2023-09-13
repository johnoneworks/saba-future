import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import bigBallParticle from "../../particle/bigBallParticle";
import smallBallParticle from "../../particle/smallBallParticle";
import styles from "./EntrancePage.module.scss";

const EntrancePage = () => {
    const particlesInit = async (main) => {
        await loadFull(main);
    };

    return (
        <div className={styles.wrap}>
            <div className={styles["e-loadholder"]}>
                <div className={styles["m-loader"]}>
                    <span className={styles["e-text"]}>
                        <img src="/logo.svg" alt="placeholder" width={140} height={140} />
                    </span>
                </div>
            </div>

            <div className={styles.container}>
                <div className={styles.loadbar}>
                    <div className={styles.loadfill}></div>
                </div>
                <h3 className={styles.text}>
                    Loading..<div className={styles.blinkdot}>.</div>
                </h3>
            </div>

            <Particles className={styles["particle-canvas"]} init={particlesInit} options={smallBallParticle} />
            <Particles className={styles["particle-canvas"]} init={particlesInit} options={bigBallParticle} />
        </div>
    );
};

export default EntrancePage;
