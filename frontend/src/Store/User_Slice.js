import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuth: false,
    User: {
        id: '',
        name: '',
        email: '',
        avatar: ''
    }
};

export const UserSlice = createSlice({
    name: 'UserSlice',
    initialState,
    reducers: {
        setUserState: (state, action) => {
            state.User = { ...action.payload.user };
            state.isAuth = action.payload.auth;
        },
        setUserAvatar: (state, action) => {
            console.log(action.payload);
            state.User.avatar = action.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const { setUserState, setUserAvatar } = UserSlice.actions;

export default UserSlice.reducer;