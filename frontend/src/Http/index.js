import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
    headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
    },
});


/// list of all the end Points
export const sendOtp = (data) => api.post('/api/auth/send-otp', data);
export const verifyOtp = (data) => api.post('/api/auth/verify-otp', data);
export const activateUser = (data) => api.post('/api/auth/activate', data);

// Interceptor for access token refresh
api.interceptors.response.use(
    (config) => {
        return config;
    },
    async (err) => {
        const originalRequest = err.config;
        if (err.response.status === 401 && originalRequest && !originalRequest.isRetry) {
            originalRequest.isRetry = true;
            try {
                await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/auth/refresh`,
                    { withCredentials: true }
                );
                return api.request(originalRequest)
            } catch (err) {
                console.log(err);
            }
        }
        throw err
    }
);

export default api;