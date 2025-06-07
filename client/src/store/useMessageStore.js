import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"
import { useAuthStore } from "./useAuthStore.js";
import axios from "axios";

export const useMessageStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isLoadingUsers: true,
    isMessagesLoading: false,
    isSendingImage: false,
    isTyping: false,
    typingTimeout: null,
    deleteCheck: false,

    getUsers: async () => {
        set({ isLoadingUsers: true })
        try {
            const response = await axiosInstance.get("/messages/users");
            set({ users: response.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch users")
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
            toast.error(error.response?.data?.message || "Failed to fetch messages");
        } finally {
            set({ isMessagesLoading: false })
        }
    },

    setSelectedUser: (selectedUser) => {
        const currentSelectedUser = get().selectedUser;
        // Only clear messages if selecting a different user
        if (!currentSelectedUser || currentSelectedUser._id !== selectedUser?._id) {
            set({ selectedUser, messages: [] });
        } else {
            set({ selectedUser });
        }
    },

    setTypingStatus: (status) => {
        const { typingTimeout } = get();

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        set({ isTyping: status });

        if (status) {
            const timeout = setTimeout(() => {
                set({ isTyping: false });
            }, 3000);
            set({ typingTimeout: timeout });
        }
    },

    sentMessages: async (messagesData) => {
        set({ isSendingImage: true })
        const { selectedUser, messages } = get();

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messagesData);
            set({ messages: [...messages, res.data] });
            return res.data;
        } catch (error) {
            console.error("Error in sentMessages:", error.response?.data || error);
            toast.error(error.response?.data?.message || "Failed to send message");
            throw error;
        } finally {
            set({ isSendingImage: false })
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        if (!socket?.connected) {
            console.error("Socket not connected");
            return;
        }

        // Remove any existing listeners first
        socket.off("newMessage");

        socket.on("newMessage", (newMessage) => {
            const currentMessages = get().messages;
            set({ messages: [...currentMessages, newMessage] });
        });
    },

    unsubscribesFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (socket?.connected) {
            socket.off("newMessage");
        }
    },

    toggleDeleteCheck: () => {
        set((state) => ({ deleteCheck: !state.deleteCheck }))
    },

    //deleting only one side
    deleteMessageFromMe: async (message) => {

        try {
            if (message.senderId === get().authUser._id) {
                const response = await axiosInstance.put(`/messages/partialDelete/${message._id}`, {
                    deleteForSender: true
                });
                if (response.status === 200) {
                    get().toggleDeleteCheck();
                }
            } else {
                const response = await axiosInstance.put(`/messages/partialDelete/${message._id}`, {
                    deleteForReciever: true
                });
                if (response.status === 200) {
                    get().toggleDeleteCheck();
                }
            }
        } catch (error) {
            console.log("Error in DeleteInterFace", error)
            toast.error("Error while deleting")
        }
    },

    // deleteinh from both the sides
    deleteMessageFromAll: async () => {
        try {
            const response = await axiosInstance.delete(`/messages/fullDelete/${message._id}`)
            if (response.status === 200) {
                get().toggleDeleteCheck();
            }
            set((state) => ({
                messages: state.messages.filter(msg => msg._id !== message._id)
            }));
        } catch (error) {
            console.log("Error in DeleteInterFace", error)
            toast.error("Error while deleting")
        }
    },

}))