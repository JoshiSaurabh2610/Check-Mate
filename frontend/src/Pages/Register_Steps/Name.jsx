import React, { useState } from 'react'
import Button from '../../Components/Button'
import Card from '../../Components/Card'
import Input from '../../Components/Input';
import {useDispatch,useSelector} from 'react-redux';
import { setUserName } from '../../Store/authSlice';

const Name = ({ onNext }) => {
    const {user} = useSelector(state => state.auth)
    const [name, setName] = useState(user.name);
    const dispatch = useDispatch();

    function nextHandler(){
        dispatch(setUserName(name));
        onNext();
    }

    return (
        <div className="cardWrapper">
            <Card heading="What's your Full Name?" imoji="logo">
                <Input onChange={(e) => setName(e.target.value)} type="text" />
                <p className="subHeading">
                    People use their Real Name at coder house!
                </p>
                <div style={{marginTop:'40px'}}>
                    <Button text="Next" onClick={nextHandler} />
                </div>
            </Card>
        </div>
    )
}

export default Name
