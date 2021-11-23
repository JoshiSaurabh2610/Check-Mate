import axios from 'axios';

console.log(process.env.REACT_APP_API_URL);
console.log(process.env);
const API = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true,
    headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
    },
});

// list of all end points
export const sendOTP = (data) => API.post('/api/auth/sendOTP', data);
export const register = (data) => API.post('/api/auth/register', data);
export const loginHandler = (data) => API.post('/api/auth/login', data);
export const setAvatar = (data) => API.post('/api/auth/setAvatar', data);
export const refresh = (data) => API.post('/api/auth/refresh', data);
export const logout = () => API.post('/api/auth/logout');
export const changePassword = (data) => API.patch('/api/auth/changePassword', data);
export const changeName = (data) => API.patch('/api/auth/setName', data);
export const googleLogin = (data) => API.post('/api/auth/googleLogin', data);
export const resetPassword = (url, data) => API.post(`${url}`, data);
export const forgotPassword = (data) => API.post('/api/auth/forgotPassword', data);


// Interceptor for access token refresh
API.interceptors.response.use(
    (config) => {
        return config;
    },
    async (err) => {
        const originalRequest = err.config;
        if (err.response.status === 401 && originalRequest && !originalRequest.isRetry) {
            originalRequest.isRetry = true;
            try {
                await axios.get(
                    // `${process.env.REACT_APP_API_URL}/api/auth/refresh`,
                    "http://localhost:5000/api/auth/refresh",
                    { withCredentials: true }
                );
                return API.request(originalRequest)
            } catch (err) {
                console.log(err);
            }
        }
        throw err
    }
);

export default API;