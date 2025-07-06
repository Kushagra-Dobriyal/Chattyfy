import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://chattyfy-backend:3000/api",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});