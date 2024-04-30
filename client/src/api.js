import axios from "axios"
import { ACCESS_TOKEN } from "./constants";

const apiUrl = "https://14d9ce7d-48ae-4030-8df3-4048f15e10cf-dev.e1-us-cdp-2.choreoapis.dev/helppp/backend/rest-api-be2/v1.0";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

//https://stackoverflow.com/questions/78224965/unable-to-use-env-files-with-vite-and-vue-3#:~:text=The%20error%20you%20are%20encountering,trying%20to%20access%20the%20variables.