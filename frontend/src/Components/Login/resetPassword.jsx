import React, { useState } from 'react'
import { useHistory } from 'react-router';
import { resetPassword } from '../../Http';
import Input from '../Input';
import Loader from '../Loader';
import classes from './resetPassword.module.css';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [sucessMsg, setSucessMsg] = useState('');
    const history = useHistory();

    const submitHandler = async () => {
        if (confirmPassword !== newPassword) {
            return setErrMsg("Password Doesn't Match");
        }
        setLoading(true);
        const url = `http://localhost:5000/api/auth${history.location.pathname}`;
        try {
            const { data } = await resetPassword(url, { newPassword });
            console.log(data);
            setSucessMsg("Password Reset Sucessfully. Redirecting to Login Page");
            //REdirect to Login Page
            setTimeout(() => {
                setLoading(false);
                history.push('/login');
            }, 2000);
        } catch (err) {
            console.log(err);
            setLoading(false);
            // console.log(err.response.data);
            setErrMsg(err.response.data.msg.name);
        }

    }
    return (
        <div className={classes.container}>
            <h2 style={{ color: "#000075", fontWeight: "bold" }}>Reset Your Password</h2>
            {sucessMsg && <div className="sucessMsg">{sucessMsg}</div>}
            {
                loading ? <Loader />
                    :
                    <>
                        {errMsg && <div className="errorMsg">{errMsg}</div>}
                        <Input
                            style={{ color: "var(--ternary)" }}
                            width="full"
                            label="Enter New Password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)} />
                        <Input
                            width="full"
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} />

                        <button type="text" className={classes.btn} onClick={submitHandler}>Submit</button>
                    </>
            }
        </div >
    )
}

export default ResetPassword;
