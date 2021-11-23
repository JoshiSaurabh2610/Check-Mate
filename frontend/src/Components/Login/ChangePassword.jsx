import React, { useState } from 'react'
import { changePassword } from '../../Http';
import Input from '../Input.jsx';
import styles from './ChangePassword.module.css'

const ChangePassword = () => {

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    async function submitHandler() {
        console.log(oldPassword, newPassword, confirmPassword);
        try {
            const { data } = await changePassword({ oldPassword, newPassword });
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className={styles.container}>
            <h2>Change Password</h2>
            <Input width="full" label="Old Password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
            <Input width="full" label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <Input width="full" label="Confirm Password" type="text" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <button className={styles.btn} onClick={submitHandler}>Submit</button>
        </div>
    )
}

export default ChangePassword;