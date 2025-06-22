import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import axios from "axios";
import {io} from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,

  isSigningUp: false,
  isLoggingIng: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check-auth");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
      console.log("Error In Check Auth: ", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      get().connectSocket();
      toast.success("Account Created Successfully");
    } catch (error) {
      toast.error(error.response.data.error);
      // console.log(error.response.data.error)
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      get().disconnectSocket();
      toast.success("Loged out successfully");
    } catch (error) {
      toast.error("Error In Log Out");
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error("Server Error ");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: ()=>{
    const {authUser} = get()
    if(!authUser || get().socket?.conneted) return;
    const socket = io(BASE_URL,{
      query:{
        userId: authUser._id
      }
    });
    set({socket:socket})
    socket.on("getOnlineUsers",(usersId)=>{
      set({onlineUsers:usersId})
    })
  },
  disconnectSocket: ()=>{
    if(get().socket?.connected) get().socket.disconnect()
  },
}));
