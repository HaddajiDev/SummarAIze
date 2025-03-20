import {create} from "zustand";
import instanceAxios from "../lib/axios";
import { message } from 'antd';

const useHistoryStore = create((set,get)=>({
    history: null,

    getHistory: async(userId) => {
        try {
            const result = await instanceAxios.get(`/api/history?userId=${userId}`);
            set({history: result.data.history});
            console.log(result.data.history);
        } catch (error) {
            console.log("get history error", error);
        }
    },

    deleteHistory: async(pdfId) => {
        try {            
            await instanceAxios.delete(`/api/history/${pdfId}`);
            message.success("PDF deleted successfully");
        } catch (error) {
            console.log("delete pdf error", error);
        }
    }
}))


export default useHistoryStore;