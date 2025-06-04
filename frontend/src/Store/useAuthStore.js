import {create} from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'

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

    signUp: async(data)=>{
        set({isSigningUp: true})
        try {
           const res=  await axiosInstance.post('/auth/signup', data)
           set({authUser: res.data})
           toast.success("Account Created Successfully")
        } catch (error) {
            toast.error("Error In Sign Up")
        } finally {
            set({isSigningUp: false})
        }
    }


    // setAuthUser: (user) => set({authUser: user, isCheckingAuth: false}),
    // setUser: (user) => set({user}),
    // logout: () => set({user: null}),
}))