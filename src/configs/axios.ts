import { rootStore } from "../stores/root/root";
import axios from "axios";

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
            rootStore.dispatch({ type: "SET_USER", payload: null });
        }
        return Promise.reject(error);
    }
);

export default $api;