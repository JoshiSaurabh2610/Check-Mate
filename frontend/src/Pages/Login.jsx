import React, { useState } from 'react'
import Otp from './Register_Steps/Otp';
import PhoneEmail from './Register_Steps/PhoneEmail';

const StepComp = {
    1: PhoneEmail,
    2: Otp,
};


const Login = () => {
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
export default Login
