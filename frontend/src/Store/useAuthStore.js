import {create} from 'zustand'
import { axiosInstance } from '../lib/axios.js'

export const useAuthStore = create((set) => ({
    authUser: null,

    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get('/auth/check-auth')
            set({authUser: res.data})
        } catch (error) {
            set({authUser: null})
            console.log("Error In Check Auth: ",error)
        } finally {
            set({isCheckingAuth: false})
        }
    },

    signUp: async()=>{
        
    }


    // setAuthUser: (user) => set({authUser: user, isCheckingAuth: false}),
    // setUser: (user) => set({user}),
    // logout: () => set({user: null}),
}))