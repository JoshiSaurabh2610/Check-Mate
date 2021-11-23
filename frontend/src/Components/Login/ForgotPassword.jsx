import React, { useState } from 'react'
import { forgotPassword } from '../../Http';
import Loader from '../Loader';
import Input from '../Input';
import classes from './resetPassword.module.css';
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [sendMsg, setSendMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        setLoading(true);
        if (!email) {
            setLoading(false);
            return setErrMsg("Plz Enter Your Email Address");
        }
        e.preventDefault();
        console.log("Submit Handler Called");
        try {
            const { data } = await forgotPassword({ email });
            console.log({ ...data });
            setLoading(false);
            setSendMsg(`${data.msg} Check your email. Reset Link valid for only 10mins`);

        } catch (err) {
            console.log({ ...err });
            // console.log(err.response.data.msg);
            setLoading(false);
            setErrMsg(err.response.data.msg);
        }
    }

    return (
        <div className={classes.container}>
            {loading ? <Loader /> :
                sendMsg ?
                    <div className="sucessMsg">{sendMsg}</div>
                    :
                    <>
                        <h2 style={{ color: "#000075", fontWeight: "bold", margin: "20px" }}>Forgot Password</h2>
                        {errMsg && <div className="errorMsg">{errMsg}</div>}
                        <Input
                            style={{ color: "var(--ternary)" }}
                            width="full"
                            label="Registerd Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <p style={{ color: '#000075', fontSize: '15px', marginTop: '15px', textAlign: 'center' }}>Password Reset Link will be send to Your Registerd email addresss. Which will be valid for only 10 mins. </p>
                        <button type="submit" className={classes.btn} onClick={submitHandler}>Send Email</button>
                    </>
            }
        </div>
    )
}

export default ForgotPassword
