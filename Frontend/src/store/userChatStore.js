import { create } from "zustand";
import api from "../services/api.js";
import { useAuthStore } from "./useAuthStore.js";
import toast from "react-hot-toast";
// import { getMessage } from "../../../Backend/src/controllers/message.controller";
// import { Subscript } from "lucide-react";


export const useChatStore = create((set, get)=>({
    users:[],
    messages:[],
    selectedUser:null,
    isUserLoading:false,
    isMessageLoading:false,
    getUsers:async () => {
        set({isUserLoading:true});
        try {
            const res = await api.get("/message/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(
                error.response.data.message ||
                "Something went wrong while fetching user"
            );
        } finally {
          set({ isUserLoading: false });
        }
    },
    getMessage: async (userId) => {
        set({ isMessageLoading: true });
        try {
            const res = await api.get(`/message/${userId}`);
            set({ message: res.data });
        } catch (error) {
            toast.error(
              error.response.data.message ||
                "Something went wrong while fetching user"
            );
        } finally {
          set({ isMessageLoading: false });
    }
 },
 setMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
        const res = api.post(`/message/send/${selectedUser._id}`, messageData);
        set({ messages: [...messages, res.data] });
    } catch (error) {
        toast.error(
              error.response.data.message ||
                "Something went wrong while sending user"
            );
    }
 },

 subscribeToMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      const isMessageSendFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSendFromSelectedUser) return;
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },
  unsubscribeToMessage: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },

}));
