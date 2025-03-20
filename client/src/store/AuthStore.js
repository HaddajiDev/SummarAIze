import {create} from "zustand";
import instanceAxios from "../lib/axios";
import { message } from 'antd';
import { redirect } from "react-router-dom";
import useHistoryStore from "./History";
import usePDFStore from "./PDFStore";

const useAuthStore = create((set,get)=>({
    user: null,
    signupLoading: false,
    loginLoading: false,

    handleSignUp: async (data) => {
        set({ signupLoading: true });
        try {
            const res = await instanceAxios.post('/auth/signup', { ...data });
            set({ user: res.data.user });
            redirect("/view");
            message.success("Signup successful");
        } catch (err) {
            console.log("signup error", err);
            message.error(err.response?.data?.message || "Something went wrong");
        } finally {
            set({ signupLoading: false });
        }
    },
    handleLogin: async (data) => {
        set({ loginLoading: true });
        try {
            const res = await instanceAxios.post('/auth/login', { ...data });
            set({ user: res.data.user });
            const getHiss = useHistoryStore.getState().getHistory; 
            getHiss(res.data.user.id);
            redirect("/view");
            message.success("Login successful");
        } catch (err) {
            console.log("login error", err);
            message.error(err.response?.data?.message || "Something went wrong");
        } finally {
            set({ loginLoading: false });
        }
    },
    handleLogout: async () => {
        try {
            await instanceAxios.post('/auth/logout');
            set({ user: null });
            const clear = usePDFStore.getState().clear;
            clear();
            message.success("Logout successful");
        } catch (err) {
            console.log("logout error", err);
            message.error(err.response?.data?.message || "Something went wrong");
        }
    },
    checkAuth: async () => {
        try {
            const res = await instanceAxios.get('/auth/user');
            set({ user: res.data.user });
            console.log(res.data.user);
        } catch (err) {
            console.log("getUser error", err);
        }
    }
}));
export default useAuthStore;