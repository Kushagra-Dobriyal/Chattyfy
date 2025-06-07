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
    }
}))