import axios from 'axios';

const api = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
    headers:{
        'Content-type' : 'application/json',
        Accept: 'application/json',
    },    
});


/// list of all the end Points
export const sendOtp = (data) => api.post('/api/auth/send-otp',data);

export const verifyOtp = (data) => api.post('/api/auth/verify-otp',data);

export default api;