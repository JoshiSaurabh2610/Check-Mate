import React, { useState } from 'react'
import Avatar from './Register_Steps/Avatar';
import Name from './Register_Steps/Name';

const StepComp = {
    1: Name,
    2: Avatar,
};

const Activate = () => {

    const [stepNum, setStepNum] = useState(1);
    const CurrComp = StepComp[stepNum];
    
    const nextStep = () => {
        console.log("next clicked");
        setStepNum(stepNum + 1);
    }

    return (
        <div>
            <CurrComp onNext={nextStep} />
        </div>
    )
}

export default Activate
