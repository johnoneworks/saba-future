import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import bigBallParticle from "../../particle/bigBallParticle";
import smallBallParticle from "../../particle/smallBallParticle";
import styles from "./LoadingAnimation.module.scss";

const LoadingAnimation = ({ useComponentLoading }) => {
    const particlesInit = async (main) => {
        try {
            await loadFull(main);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            {useComponentLoading ? (
                <div className={styles["component-wrap"]}>
                    <span className={styles["e-text"]}>
                        <img src="/logo_blue.svg" alt="placeholder" width={140} height={140} />
                        <div className={styles.container}>
                            <div className={styles.loadbar}>
                                <div className={styles.loadfill}></div>
                            </div>
                            <h3 className={styles.text}>
                                Loading..<div className={styles.blinkdot}>.</div>
                            </h3>
                        </div>
                    </span>
                </div>
            ) : (
                <div className={styles.wrap}>
                    <div className={styles["e-loadholder"]}>
                        <div className={styles["m-loader"]}>
                            <span className={styles["e-text"]}>
                                <img src="/logo.svg" alt="placeholder" width={140} height={140} />
                            </span>
                        </div>
                    </div>

                    <Particles id="particle-small-canvas" init={particlesInit} options={smallBallParticle} />
                    <Particles id="particle-canvas" init={particlesInit} options={bigBallParticle} />
                </div>
            )}
        </>
    );
};

export default LoadingAnimation;
