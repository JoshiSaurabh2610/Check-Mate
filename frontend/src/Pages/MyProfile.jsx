
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Components/Loader';
import { changeName, setAvatar } from '../Http';
import { setUserAvatar, setUserState } from '../Store/User_Slice';
import styles from './MyProfile.module.css';

const MyProfile = () => {

    const { User } = useSelector(state => state.User);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();


    useEffect(() => {
        setName(User.name);
        console.log("UseEFfect of MyProfile called");
    }, [User]);

    async function changeNameHandler(e) {
        e.preventDefault();
        try {
            const { data } = await changeName({ newName: name });
            console.log({ ...data });
            dispatch(setUserState({ user: data.user, auth: true }));
        } catch (err) {
            console.log(err);
        }
    }

    async function imgCaptureHandler(e) {
        const file = e.target.files[0];
        if (!file)
            return;
        if (file.type.split('/')[0] !== 'image') {
            console.log(file.type);
            // return setErrorMsg('File Not Supported');
            return;
        }
        // convert to base64
        const reader = new FileReader();
        reader.addEventListener('error', () => {
            console.log(`Error occurred reading file: ${file.name}`);
            // setErrorMsg('error occured......');
            return;
        });
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            // console.log("file loaded Sucessfully");
            setLoading(true);
            setAvatar({ NewAvatar: reader.result }).then(({ data }) => {
                console.log(data);
                dispatch(setUserAvatar(data.user.avatar));
                setLoading(false);
            }).catch((err) => {
                console.log(err, "from Onloadend");
                setLoading(false);
            })
            // console.log(reader.result);
        }

    }

    return (
        <div className={styles.container}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Profile Photo</h2>
            <div className={styles.profileSection}>
                <div className={styles.avatarWrapper}>
                    {loading ? <Loader /> : <img className={styles.avatarImg} src={User.avatar ? User.avatar : '/images/monkey-avatar.png'} alt="avatar" />}
                </div>
                <input
                    id="avatarInput"
                    style={{ display: 'none' }}
                    type="file"
                    onChange={imgCaptureHandler} />
                <label htmlFor="avatarInput" className={`${styles.btn} ${styles.btnSecondary}`}>
                    Change Photo
                </label>
            </div>

            <Fields
                label="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onSave={changeNameHandler} />

            <Fields
                label="Email"
                type="email"
                value={User.email}
                notEdit />

        </div>
    );
}

export default MyProfile


const Fields = ({ label, notEdit, onSave, onChange, ...props }) => {
    const [edit, setEdit] = useState(false);
    return (
        <div className={styles.fieldsWrapper}>
            <label style={{ fontSize: '18px', fontWeight: 'bold' }}>{label}</label>
            <div className={styles.inputWrapper}>
                <input disabled={!edit} className={edit ? `${styles.fieldInput} ${styles.active}` : `${styles.fieldInput}`} {...props} onChange={onChange} />
                {!edit && <button disabled={notEdit} onClick={() => setEdit(true)} className={styles.btn}>Edit</button>}
            </div>
            {
                edit &&
                <div>
                    <button
                        type="submit"
                        style={{ marginLeft: "20px" }}
                        onClick={(e) => { onSave(e); setEdit(false) }}
                        className={`${styles.btn} ${styles.btnSucess}`}>
                        Save
                    </button>
                    <button
                        style={{ marginLeft: "20px" }}
                        onClick={() => setEdit(false)}
                        className={`${styles.btn} ${styles.btnDanger}`}>
                        Cancel
                    </button>
                </div>
            }
        </div>
    )
};