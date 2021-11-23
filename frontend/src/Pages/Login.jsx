import React from 'react'
import LoginRegisterForm from '../Components/Login/LoginRegisterForm';

const style = {
    display: " flex",
    alignItems: " center",
    justifyContent: " center",
    marginTop: "30px"
};

const Login = () => {
    return (
        <div style={style}>
            <LoginRegisterForm tabBorderColor="#fff" />
        </div>
    )
}

export default Login
