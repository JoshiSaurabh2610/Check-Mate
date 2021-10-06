import React, { useState } from 'react'
import Styles from './Register.module.css';
import Avatar from './Register_Steps/Avatar';
import Name from './Register_Steps/Name';
import Otp from './Register_Steps/Otp';
import PhoneEmail from './Register_Steps/PhoneEmail';
import Username from './Register_Steps/Username';

const StepComp = {
    1: PhoneEmail,
    2: Otp,
    3: Name,
    4: Avatar,
    5: Username
};


const Register = () => {


    const [stepNum, setStepNum] = useState(1);
    const CurrComp = StepComp[stepNum];
    
    const nextStep = () => {
        console.log("next clicked");
        setStepNum(stepNum + 1);
    }

    return (
        <div>
            <CurrComp onClick={nextStep} />
        </div>
    )
}

export default Register
