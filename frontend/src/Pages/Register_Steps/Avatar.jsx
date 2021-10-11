import React, { useState } from 'react'
import Button from '../../Components/Button'
import Card from '../../Components/Card'
import { useDispatch, useSelector } from 'react-redux';
import styles from './Avatar.module.css';
import { activateUser } from '../../Http';
import { setAuth, setUserAvatar } from '../../Store/authSlice';
import Loader from '../../Components/Loader';

const Name = ({ onNext }) => {
    const { user } = useSelector(state => state.auth)
    const [image, setImage] = useState('/images/monkey-avatar.png');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    async function submitHandler() {
        if (!user.name || user.avatar)
            return;
        setLoading(true);
        try {
            const { data } = await activateUser({ userName: user.name, userAvatar: user.avatar });
            console.log(data);
            dispatch(setAuth(data));
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    function imgCaptureHandler(e) {
        const file = e.target.files[0];
        // convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImage(reader.result);
            dispatch(setUserAvatar(reader.result));
        }
    }
    if (loading)
        return <Loader msg="Activation in Progress" />
    return (
        <div className="cardWrapper">
            <Card heading={`hi, ${user.name}`} imoji="logo">
                <p className="subHeading">
                    How is this photo?
                </p>
                <div className={styles.avatarWrapper}>
                    <img className={styles.avatarImg} src={image} alt="avatar" />
                </div>
                <div>
                    <input
                        id="avatarInput"
                        style={{ display: 'none' }}
                        type="file"
                        onChange={imgCaptureHandler} />
                    <label className={styles.avatarInpLabel} htmlFor="avatarInput">Choose a different profile image</label>
                </div>

                <Button text="Next" onClick={submitHandler} />
            </Card>
        </div>
    )
}

export default Name
