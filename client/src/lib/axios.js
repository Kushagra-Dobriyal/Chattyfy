import axios from "axios";

export const axiosInstance=axios.create({
    baseURL:"http/localhost:3000/api",
    withCredentials:true,
    //thsi will send cookies in every single request
})