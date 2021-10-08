import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuth: false,
    user: null,
    otp: {
        phoneNo: '',
        hash: ''
    }
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            const {user} = action.payload;
            state.user = user;
            state.isAuth = true;
        },
        setOtp: (state, action)=>{
            // console.log("inside set OTP auth slice");
            const {phoneNo,hash} = action.payload;
            // console.log(action.payload);
            state.otp = action.payload; 
        }
    },
})

// Action creators are generated for each case reducer function
export const { setAuth, setOtp } = authSlice.actions

export default authSlice.reducer