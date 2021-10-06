import React from 'react'
import Style from './Button.module.css';

const Button = ({ text, onClick }) => {
    return (
        <button onClick={onClick} className={Style.button}>
            <span>{text}</span>
            <img className={Style.arrow} src="/images/arrow-forward.png" alt="->" />
        </button>
    )
}

export default Button
