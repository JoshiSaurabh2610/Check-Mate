import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuth: false,
    user: {
        activated: false,
        avatar: '',
        name: '',
    },
    otp: {
        phoneNo: '',
        hash: ''
    }
}
// const initialState = {
//     isAuth: true,
//     user: {
//         id: "6161464b383720488c860262",
//         phoneNo: "54654668",
//         activated: false,
//         createdAt: "2021-10-09T07:35:39.353Z",
//     },
//     otp: {
//         phoneNo: "54654668",
//         hash: "a18156164c6694f38f710b2b245ed54e1c1dcce4f369bbd808f4351cc818984c_1633765049905"
//     }
// };

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            const { user } = action.payload;
            state.user = user;
            state.isAuth = true;
        },
        setOtp: (state, action) => {
            // console.log("inside set OTP auth slice");
            // const { phoneNo, hash } = action.payload;
            // console.log(action.payload);
            state.otp = action.payload;
        },
        setUserAvatar: (state, action) => {
            state.user.avatar = action.payload;
        },
        setUserName: (state, action) => {
            state.user.name = action.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const { setAuth, setOtp, setUserName, setUserAvatar } = authSlice.actions

export default authSlice.reducer