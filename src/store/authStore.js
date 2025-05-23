import {create} from "zustand";
import axios from "axios";
import { toast } from 'react-toastify';

const API_URL="https://e00b9c6e-c83f-4128-ad14-bdefaa6706b1-00-2poweyqxv7eop.sisko.replit.dev/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set)=>({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,
    resetError: () => set({ error: null }),

    signup: async(name, email, phone, password)=>{
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${API_URL}/signup`,{name,email,phone,password});
            set({user: response.data.user, isAuthenticated: true, isLoading: false});
        } catch (error) {
            set({error: error.response.data.message || "Error Signing Up", isLoading: false});
            throw error; 
        }
    },
    login: async(email,password) => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${API_URL}/login`,{email,password});
            set({user: response.data.user, isAuthenticated: true, isLoading: false});
        } catch (error) {
            set({error: error.response?.data?.message || "Error Logging In", isLoading: false});
            throw error; 
        }
    },
    logout: async() =>{
        set({isLoading: true, error: null});
        try {
            await axios.post(`${API_URL}/logout`);
            set({user: null, isAuthenticated: false, isLoading: false, error: null});
            toast.success("Logout Successfully!");
        } catch (error) {
            set({error: "Error Logging Out", isLoading: false});
            throw error; 
        }
    },
    verifyEmail : async(code) =>{
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${API_URL}/verify-email`,{code});
            set({user: response.data.user, isAuthenticated: true, isLoading: false});
            return response.data;
        } catch (error) {
            set({error: error.response.data.message || "Error Verifying Email", isLoading: false});
            throw error;
        }
    },
    checkAuth: async() =>{
        await new Promise((resolve)=> setTimeout(resolve, 1000));
        set({isCheckingAuth: true, error:null});
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            set({user: response.data.user, isAuthenticated: true, isCheckingAuth: false});
        } catch (error) {
            set({error: null, isCheckingAuth: false, isAuthenticated: false});
        }
    },
    forgotPassword: async(email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},
    resetPassword: async(token, password) =>{
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
            set({message: response.data.message , isLoading: false});
        } catch (error) {
            set({
				isLoading: false,
				error: error.response.data.message || "Error Resetting Password",
			});
			throw error;
        }
    },
}));  