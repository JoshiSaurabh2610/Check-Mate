import React from 'react';
import Style from './Card.module.css';
const Card = (props) => {
    return (
        <div className={Style.card}>
            <div className={Style.headingWrapper}>
                {props.imoji && <img src={`/images/${props.imoji}.png`} alt={`${props.imoji}`} />}
                <h1>{props.heading}</h1>
            </div>
            {props.children}
        </div>
    )
}

export default Card
