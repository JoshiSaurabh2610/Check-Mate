import { configureStore } from '@reduxjs/toolkit'
import User_Slice from './User_Slice.js';

export const store = configureStore({
    reducer: {
        User: User_Slice
    },
})
