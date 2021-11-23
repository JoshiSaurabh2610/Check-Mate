import React from 'react'
import GoogleLogin from 'react-google-login';
import { useDispatch } from 'react-redux';
import { googleLogin } from '../../Http';
import { setUserState } from '../../Store/User_Slice';
import styles from './LoginRegisterForm.module.css';
const LoginWithGoogle = ({ errorMsg, setErrorMsg }) => {
    const dispatch = useDispatch();

    async function responseGoogleHandler(googleResp) {
        console.log(googleResp);
        console.log(googleResp.profileObj);
        try {
            const { data } = await googleLogin({ token: googleResp.tokenId });
            console.log(data);
            dispatch(setUserState(data));
            setErrorMsg('');
        } catch (err) {
            console.log(err);
            setErrorMsg(err.response.data.msg);
        }
    }
    async function onFailureHandler(googleResp) {
        console.log(googleResp);
    }
    return (
        <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            onSuccess={responseGoogleHandler}
            onFailure={onFailureHandler}
            cookiePolicy={'single_host_origin'}
            render={(renderProps) => {
                return <button className={styles.googleLoginBtn} disabled={renderProps.disabled} type="text" onClick={renderProps.onClick}>Google Login</button>
            }}
        />
    )
}

export default LoginWithGoogle;
