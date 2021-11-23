import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserState } from "../Store/User_Slice";
export function useLoadingWithRefresh() {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(
                    // `${process.env.REACT_APP_API_URL}/api/auth/refresh`,
                    "http://localhost:5000/api/auth/refresh",
                    {
                        withCredentials: true,
                    }
                )
                console.log(data);
                dispatch(setUserState(data));
                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        })();
    }, [dispatch])
    return { loading };
}