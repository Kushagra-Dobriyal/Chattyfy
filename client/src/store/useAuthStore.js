import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast";
import { ArrowUp, CopySlash, Flashlight } from "lucide-react";
import axios from "axios";

export const useAuthStore = create((set) => ({ //set is a function you use to update the state.

    //here we will define global states
    //these states can directly be called and be used from anywwher after importing them in the file

    authUser: null,
    isSigningup: false,
    isLoggingin: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,


    //defining the methods...
    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axiosInstance.get("/auth/check"); //not typing /api as in the axios library (axio.js) we have already implement that much ,so we are always building on top of that....

            //  [baseURL:"http/localhost:3000/api"]

            set({ authUser: res.data })
            //On success, the user's data is stored in authUser

        } catch (error) {
            set({ authUser: null });
            //On failure, authUser is set to null
        }
        finally {
            set({ isCheckingAuth: false });
        }
    },


    signup: async (data) => {
        set({ isSigningup: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("You have successfully signed-up");

        } catch (error) {
            toast.error("Erroe,user might already exist");
            console.log("Error at signup at store")
            console.log(error);
        } finally {
            set({ isSigningup: false });
        }

    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("You have logged out");
        } catch (error) {
            toast.success("Oops!!,something went wrong");
            console.log("error form the logout func in store")
            console.log(error)
        }
    },

    login: async (data) => {
        set({ isLoggingin: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success(`Welcome back ${res.data.fullName}`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            console.log("The error is in login in store");
            console.log(error);
        }
        finally {
            set({ isLoggingin: false });
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", {
                profilePic: data.profilePic
            });
            set({ authUser: res.data });
            return true;

        } catch (error) {
            console.log("Error in the updateProfile in authstore");
            console.log(error);
            return false;
        } finally {
            set({ isUpdatingProfile: false })
        }
    }





}))