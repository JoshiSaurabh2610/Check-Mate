import React, { useState } from 'react'
import Button from '../../Components/Button'
import Card from '../../Components/Card'
import Input from '../../Components/Input';
import { sendOtp } from '../../Http';
import styles from '../Authenticate.module.css';
import { useDispatch } from 'react-redux';
import { setOtp } from '../../Store/authSlice';

const PhoneEmail = ({ nextStep }) => {
    const [type, setType] = useState('Phone Number');
    const [value, setValue] = useState('');

    const dispatch = useDispatch();

    async function submitHandler() {
        // server request
        if(!value)
            return;
        try {
            const { data } = await sendOtp({ phoneNo: value });
            // console.log(data);
            dispatch(setOtp({ phoneNo: data.phoneNo, hash: data.hash }));
            nextStep();

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="cardWrapper">
            <div>
                <div className={styles.buttonWrapper}>
                    <button className={`${styles.tabBtn} ${type === "Phone Number" ? styles.active : ''}`} onClick={() => { setType("Phone Number"); setValue('') }}>
                        <img src="/images/White Phone Number.png" alt="Phone" />
                    </button>
                    <button className={`${styles.tabBtn} ${type === "Email Address" ? styles.active : ''}`} onClick={() => { setType("Email Address"); setValue('') }}>
                        <img src="/images/White Email Address.png" alt="Phone" />
                    </button>
                </div>
                <Card heading={`Enter Your ${type}`} imoji={type}>
                    <Input onChange={(e) => setValue(e.target.value)} value={value} type={`${type === 'Phone Number' ? 'text' : 'email'}`} placeholder={`${type === 'Phone Number' ? '1234567890' : 'example@email.com'}`} />
                    <div className={styles.btnWrap}>
                        <Button text="Next" onClick={submitHandler} />
                    </div>
                    <p className="subHeading">
                        {`By entering Your ${type} you're agreeing to our Terms of Services and Privacy Policy. Thanks!`}
                    </p>
                </Card>
            </div>
        </div>
    )
}

export default PhoneEmail
