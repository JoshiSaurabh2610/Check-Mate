import React from 'react';
import { Link } from 'react-router-dom';
import { logoutUser } from '../Http';
import Styles from './Navigation.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../Store/authSlice';

const Navigation = () => {
    const { isAuth } = useSelector(state => state.auth)
    const dispatch = useDispatch();

    const logoStyle = {
        color: '#fff',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '22px',
        display: 'flex',
        alignItems: 'center'
    };

    const logoText = {
        marginLeft: '10px',
    }

    async function logoutHandler() {
        try {
            const data = await logoutUser();
            dispatch(setAuth(data));
        } catch (err) {
            console.log(err);
        }
    }

    return (

        <nav className={`${Styles.navbar} container`}>
            <Link style={logoStyle} to="/">
                <img src="/images/logo.png" alt="logo" />
                <span style={logoText}>Coders House</span>
            </Link>
            {isAuth && <button onClick={logoutHandler}>Logout</button>}
        </nav>
    )
}

export default Navigation
