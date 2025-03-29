import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js"

export const useAuthStore=create((set)=>({ //set is a function you use to update the state.

    //here we will define global states
    authUser:null,
    isSigningup:false,
    isLoggingin:false,
    isUpdatingProfile:false, 
    isCheckingAuth:true,


    //defining the methods...
    checkAuth:async()=>{
        try {
            const res=await axiosInstance.get("/auth/check"); //not typing /api as in the axios library (axio.js) we have already implement that much ,so we are always building on top of that....

            //  [baseURL:"http/localhost:3000/api"]

            set({authUser:res.data})
            //On success, the user's data is stored in authUser

        } catch (error) {
            set({authUser:null});
            //On failure, authUser is set to null
        }
        finally{
            set({isCheckingAuth:false});
        }
    },


    signup:async(data)=>{
        try {
            
            
        } catch (error) {
            
        }

    }


}))