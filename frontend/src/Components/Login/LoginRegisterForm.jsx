import React, { useState } from 'react'
import Input from '../Input';
import { loginHandler, register, sendOTP, setAvatar } from '../../Http';
import styles from './LoginRegisterForm.module.css';
import { useDispatch } from 'react-redux';
import { setUserState, setUserAvatar } from '../../Store/User_Slice';
import StepsBreadCrumb from '../StepsBreadCrumb';
import { Link } from 'react-router-dom';
import LoginWithGoogle from './LoginWithGoogle';

const LoginRegisterForm = () => {

    const [login, setLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');
    const [currStep, setCurrStep] = useState(1);
    const [OTP, setOTP] = useState('');
    const [avatar, setLocalAvatar] = useState('/images/monkey-avatar.png');
    const [errorMsg, setErrorMsg] = useState(null);
    const [OTPHash, setOTPHash] = useState('');
    const [disableBtn, setDisableBtn] = useState(true);

    const dispatch = useDispatch();

    async function submitLoginHandler(e) {
        e.preventDefault();
        if (!email || !password) {
            setErrorMsg("All Fields Required");
            return;
        }
        try {
            const { data } = await loginHandler({ email, password });
            console.log(data);
            dispatch(setUserState(data));
            setErrorMsg('');
        } catch (err) {
            // console.log({...err});
            // console.log(err.response.data.msg);
            setErrorMsg(err.response.data.msg);
        }
    }

    async function nextHandler(e) {
        e.preventDefault();
        if (currStep === 1) {
            if (!name || !email) {
                setErrorMsg('All Fields Required');
                return;
            }
            try {
                const { data } = await sendOTP({ name, email });
                // console.log(data.hash);
                setOTPHash(data.hash);
            } catch (err) {
                // console.log(err);
                setEmail('');
                return setErrorMsg(err.response.data.msg);
            }
        }
        else if (currStep === 2) {
            if (!OTP || !password || !confirmPassword) {
                return setErrorMsg('All Fields Required');
            }
            if (!OTPHash || !email || !name) {
                setErrorMsg('Something went wrong, Register again (from Starting)');
                return setCurrStep(1);
            }
            if (confirmPassword !== password) {
                return setErrorMsg("Password doesn't match with Confirm Password");
            }
            try {
                const { data } = await register({ email, name, hash: OTPHash, OTP, password });
                console.log(data);
                dispatch(setUserState(data));
            } catch (err) {
                setOTP('');
                setPassword('');
                setconfirmPassword('');
                setDisableBtn(false);
                return setErrorMsg(err.response.data.msg);
            }
        }
        else if (currStep === 3) {
            try {
                const { data } = await setAvatar({ NewAvatar: avatar });
                // console.log(data);
                dispatch(setUserState(data));
            } catch (err) {
                setLocalAvatar('/images/monkey-avatar.png');
                return setErrorMsg(err.response.data.msg);
            }
            setErrorMsg('');
        }
        setCurrStep(currStep + 1);
        setErrorMsg('');
    }

    async function resendOTP(e) {
        e.preventDefault();
        if (!name || !email) {
            setErrorMsg('All Fields Required');
            return;
        }
        try {
            const { data } = await sendOTP({ name, email });
            console.log(data.hash);
            setOTPHash(data.hash);
        } catch (err) {
            setEmail('');
            return setErrorMsg(err.response.data.msg);
        }
        setErrorMsg('');
    }

    function goTo(step) {
        if (step > currStep)
            return;

        if (currStep >= 2) {
            setOTP('');
            setPassword('');
            setconfirmPassword('');
        }
        if (currStep === 3) {
            setLocalAvatar('/images/monkey-avatar.png');
        }

        setCurrStep(step);
        setErrorMsg('');
    }

    const loginComp = <>
        <Input
            value={email}
            onChange={(e) => { setErrorMsg(''); setEmail(e.target.value) }}
            label="Email Address"
            type="email"
            placeholder="example@email.com" />
        <Input value={password}
            onChange={(e) => { setErrorMsg(''); setPassword(e.target.value) }}
            label="Password"
            type="password"
            placeholder="Password" />
    </>

    const NameEmail = <>
        <Input
            value={name}
            onChange={(e) => { setErrorMsg(''); setName(e.target.value) }}
            label="Name"
            type="text"
            placeholder="Full Name" />
        <Input
            value={email}
            onChange={(e) => { setErrorMsg(''); setEmail(e.target.value) }}
            label="Email Address"
            type="email"
            placeholder="example@email.com" />
    </>

    const OTP_Password = <>
        <Input
            value={OTP}
            onChange={(e) => { setErrorMsg(''); setOTP(e.target.value) }}
            label="Authentication Code (OTP) "
            type="text"
            placeholder="OTP just send to you" />
        <Input value={password}
            onChange={(e) => { setErrorMsg(''); setPassword(e.target.value) }}
            label="Password"
            type="password"
            placeholder="Password" />
        <Input
            value={confirmPassword}
            onChange={(e) => { setErrorMsg(''); setconfirmPassword(e.target.value) }}
            label="Confirm Password"
            type="password" placeholder="Confirm Password" />
    </>

    function imgCaptureHandler(e) {
        const file = e.target.files[0];
        if (!file)
            return;
        if (file.type.split('/')[0] !== 'image') {
            console.log(file.type);
            return setErrorMsg('File Not Supported');
        }
        // convert to base64
        const reader = new FileReader();
        reader.addEventListener('error', () => {
            console.log(`Error occurred reading file: ${file.name}`);
            setErrorMsg('error occured......');
            return;
        });
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            // console.log("file loaded Sucessfully");
            setLocalAvatar(reader.result);
            dispatch(setUserAvatar(reader.result));
        }
    }

    const Avatar = <>
        <p className={styles.subHeading}>
            How is this photo?
        </p>
        <div className={styles.avatarWrapper}>
            <img className={styles.avatarImg} src={avatar} alt="avatar" />
        </div>
        <input
            id="avatarInput"
            style={{ display: 'none' }}
            type="file"
            onChange={imgCaptureHandler} />
        <label className={styles.avatarInpLabel} htmlFor="avatarInput">Choose a different profile image</label>
    </>

    const stepsMap = {
        1: NameEmail,
        2: OTP_Password,
        3: Avatar,
    };

    let currComp = login ? loginComp : stepsMap[currStep];

    return (
        <div className={styles.containerBody}>
            <div className={styles.tabs} style={{ borderBottom: `12px solid black` }}>
                <div
                    className={login ? styles.active : null}
                    onClick={() => { setLogin(true); setErrorMsg(''); }}>

                    <img src="/images/key.png" alt="Login" />
                    <span>Login</span>
                </div>
                <div className={!login ? styles.active : null}
                    onClick={() => { setLogin(false); setErrorMsg(''); }}>

                    <img style={{ width: '30px' }} src="/images/account_circle.png" alt="Register" />
                    <span>Register</span>
                </div>
            </div>
            {errorMsg && <div className="errorMsg">{errorMsg}</div>}
            <form className={styles.form}>
                {!login && <StepsBreadCrumb goTo={goTo} currStep={currStep} />}
                <div className={styles.body}>
                    {currComp}
                    {login && <div className={styles.forgotPassword}>
                        <Link to="/forgotPassword">forgot password</Link>
                    </div>}
                </div>
                <div className={styles.btnWrapper}>
                    {
                        login ?
                            <>
                                <button
                                    type="submit"
                                    className={`${styles.btn} ${styles.btnPrimary}`}
                                    onClick={submitLoginHandler}
                                >
                                    Login
                                </button>
                                <LoginWithGoogle errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
                            </> : <button onClick={nextHandler} type='submit' className={`${styles.btn} ${styles.btnPrimary}`}>{currStep === 3 ? 'Finish' : 'Next'}</button>
                    }
                    {(!login && currStep === 2) && <button disabled={disableBtn} onClick={resendOTP} type='submit' className={` ${styles.btn} ${styles.btnSecondary}`}>Resend OTP</button>}
                </div>
            </form>
        </div>
    );
}

export default LoginRegisterForm;
