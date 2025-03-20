import {create} from "zustand";
import instanceAxios from "../lib/axios";
import { message } from 'antd';
import { redirect } from "react-router-dom";

const useHistoryStore = create((set,get)=>({
    history: null,

    getHistory: async(userId) => {
        try {
            const result = await instanceAxios.get(`/api/history?userId=${userId}`);
            set({history: result.data.history});
            console.log(result.data.history);
        } catch (error) {
            console.log(error);
        }
    },

    deleteHistory: async() => {
        try {            
            const result = await instanceAxios.delete(`/api/history/${pdfId}`);        
        } catch (error) {
            
        }
    }
}))


export default useHistoryStore;