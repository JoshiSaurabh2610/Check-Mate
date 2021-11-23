import React from 'react'
import styles from './Logo.module.css';
const Logo = () => {
    return (
        <div className={styles.logo}>
            <img src="/images/Logo.png" alt="logo" />
            <span>Techies Code</span>
        </div>
    )
}

export default Logo
