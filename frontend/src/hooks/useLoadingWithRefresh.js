import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../Store/authSlice";

export function useLoadingWithRefresh() {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/auth/refresh`,
                    {
                        withCredentials: true,
                    }
                )
                console.log(data);
                dispatch(setAuth(data));
                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        })();
    }, [])
    return { loading };
}