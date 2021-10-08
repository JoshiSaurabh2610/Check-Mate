import React, { useState } from 'react'
import Otp from './Register_Steps/Otp';
import PhoneEmail from './Register_Steps/PhoneEmail';

const StepComp = {
    1: PhoneEmail,
    2: Otp,
};


const Authenticate = () => {
    const [stepNum, setStepNum] = useState(1);
    const CurrComp = StepComp[stepNum];

    const nextStep = () => {
        console.log("next clicked");
        setStepNum(stepNum + 1);
    }

    return (
        <div>
            <CurrComp nextStep={nextStep} />
        </div>
    )
}
export default Authenticate
