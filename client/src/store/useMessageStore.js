import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"
import { useAuthStore } from "./useAuthStore.js";

export const useMessageStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isLoadingUsers: true,
    isMessagesLoading: false,
    isSendingImage: false,

    isTyping: false,
    typingTimeout: null,

    getUsers: async () => {
        set({ isLoadingUsers: true })
        try {
            const response = await axiosInstance.get("/messages/users");
            set({ users: response.data });

        } catch (error) {
            toast.error(error.response.data.messages)

        } finally {
            set({ isLoadingUsers: false })
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: response.data })

        } catch (error) {
            toast.error(error.response.data.messages);
        } finally {
            set({ isMessagesLoading: false })
        }

    },

    setSelectedUser: (selectedUser) => { set({ selectedUser }) },


    setTypingStatus: (status) => {
        const { typingTimeout } = get();

        // if already previous timeout is runnig first stop it 
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // update the current isTyping 
        set({ isTyping: status });

        // if the user is typing then set timeout for 3 sec
        if (status) {
            const timeout = setTimeout(() => {
                set({ isTyping: false });
            }, 3000);
            // Reset typing status after 3 seconds of no activity MEans that after 3 sec of inactivity the stuatus will be set to false;
            set({ typingTimeout: timeout });
        }
    },



    sentMessages: async (messagesData) => {
        set({ isSendingImage: true })
        const { selectedUser, messages } = get();


        try {
            console.log("Sending message to user:", selectedUser._id);
            console.log("Message data:", messagesData);

            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messagesData);
            console.log("Server response:", res.data);

            set({ messages: [...messages, res.data] });


        } catch (error) {
            console.error("Error in sentMessages:", error.response?.data || error);
            toast.error(error.response?.data?.message || "Failed to send message");
            throw error; // Re-throw to handle in component
        } finally {
            set({ isSendingImage: false })
        }
    },

    subscribeToMessages:()=>{
        const {selectedUser}=get();
        if(!selectedUser)return

        const socket=useAuthStore.getState().socket;

        //todo :optimize later
        socket.on("newMessage",(newMessage)=>{
            set({messages:[...get().messages,newMessage]})
        })

    },

    unsubscribesFromMessages:()=>{
        const socket=useAuthStore.getState().socket

        socket.off("newMessage")
    }


}))