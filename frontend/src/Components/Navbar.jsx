import React, { useState } from 'react'
import Logo from './Logo'
import styles from './Navbar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Link, useHistory } from 'react-router-dom';
import { setUserState } from '../Store/User_Slice';
import { logout } from '../Http';
import Button from './Button';
const Navbar = () => {
    const history = useHistory();
    // const dispatch = useDispatch();
    const { isAuth, User } = useSelector(state => state.User);
    const [showDropDown, setShowDropDown] = useState(false);
    const activeTab = {
        color: '#fff',
        backgroundColor: 'var(--ternary)',
        padding: '5px 10px',
    }

    function toggleDropdown() {
        if (showDropDown)
            setShowDropDown(false);
        else
            setShowDropDown(true);
    }

    return (
        <div className={styles.Navbar}>
            <Logo />
            <div className={styles.rightPart}>
                <div className={styles.tabs}>
                    <div className={styles.tab}><NavLink exact to="/" activeStyle={activeTab} >Home</NavLink></div>
                    <div className={styles.tab}><NavLink exact to="/courses" activeStyle={activeTab}>Courses</NavLink></div>
                </div>
                {
                    isAuth ?
                        <div className={styles.userWrapper}>
                            <div onClick={toggleDropdown} className={styles.avatarWrapper}>
                                <img className={styles.avatarImg} src={User.avatar ? User.avatar : '/images/monkey-avatar.png'} alt="avatar" />
                            </div>
                            {showDropDown && <UserDropdownMenu closeHandler={toggleDropdown}/>}
                        </div>
                        : <Button btnStyle="btn-outline" onClick={() => history.push('/login')}>Login</Button>
                }
            </div>
        </div >
    )
}

const UserDropdownMenu = ({ closeHandler }) => {
    const dispatch = useDispatch();
    const { User } = useSelector(state => state.User);

    async function logoutHandler() {
        const { data } = await logout();
        // console.log(data);
        dispatch(setUserState(data));
    }

    return (
        <div onClick={closeHandler} id={styles.tranparentModel}>
            <div className={styles.menu}>
                <h2>
                    {User.name}
                </h2>
                <ul>
                    <li>
                        <img src="/images/user.png" alt="icon" />
                        <Link to="/myProfile"> My Profile</Link>
                    </li>
                    <li>
                        <img src="/images/edit.png" alt="icon" />
                        <Link to="changePassword">Change Password</Link>
                    </li>
                    <li>
                        <img src="/images/log-out.png" alt="icon" />
                        <Link to="/"><span onClick={logoutHandler}>Logout</span></Link>
                    </li>
                </ul>
            </div>
        </div>
    )
};

export default Navbar
