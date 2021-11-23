import React from 'react'
import styles from './StepsBreadCrumb.module.css';

const StepsBreadCrumb = ({ currStep, goTo }) => {
    // console.log(currStep);
    return (
        <div className={styles.wrapper}>
            <div onClick={() => goTo(1)} className={styles.steps}>
                <div className={`${styles.imgWrapper} ${currStep === 1 ? styles.active : null} `}>
                    <img src={`/images/create${currStep === 1 ? 'W' : ''}.png`} alt="Step 1" />
                </div>
                <span>Email</span>
            </div>
            <div className={styles.line} />
            <div onClick={() => goTo(2)} className={styles.steps}>
                <div className={`${styles.imgWrapper} ${currStep === 2 ? styles.active : null} `}>
                    <img src={`/images/verify${currStep === 2 ? 'W' : ''}.png`} alt="Step 2" />
                </div>
                <span>Verification </span>
            </div>
            <div className={styles.line} />
            <div onClick={() => goTo(3)} className={styles.steps}>
                <div className={`${styles.imgWrapper} ${currStep === 3 ? styles.active : null}`}>
                    <img src={`/images/account_circle${currStep === 3 ? 'W' : ''}.png`} alt="Step 3" />
                </div>
                <span>Avatar</span>
            </div>
        </div>
    )
}

export default StepsBreadCrumb;
