import axios from "axios";
import userStore from "../stores/user/user";

const $api = axios.create({
    baseURL: import.meta.env.VITE_APP_SERVER_API,
    withCredentials: true
});

$api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            userStore.dispatch({ type: "SET_USER", payload: null });
        }
        return Promise.reject(error);
    }
);

export default $api;