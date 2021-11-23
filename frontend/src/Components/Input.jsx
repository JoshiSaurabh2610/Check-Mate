import React from 'react'
import styles from './Input.module.css'
const Input = ({ label, width, ...props }) => {
    const widthStyle = width === 'full' ? '100%' : width === 'half' ? '50%' : 'inherit';
    return (
        <div style={{ width: widthStyle }} className={styles.InputWrapper}>
            <div>
                <label className={styles.label}>{label}</label><br />
                <input className={styles.Input} {...props} />
            </div>
        </div>
    )
}

export default Input
