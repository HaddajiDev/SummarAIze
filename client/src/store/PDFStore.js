import {create} from "zustand";
import instanceAxios from "../lib/axios";

const usePDFStore = create((set,get)=>({
    pdfUrl: null,
    uploadLoading: false,
    summary: null,
    chat: [],

    setPDFURL: (url) => set({pdfUrl:url}),

    clearPDF: () => set({pdfUrl:null}),

    uploadPDF: async (file) => {
        set({uploadLoading:true});
        console.log(file);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await instanceAxios.post('/api/upload', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            console.log(res.data);
            set({pdfUrl: res.data.url});
            set({summary: res.data.summary});
            console.log(get().summary);
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            set({uploadLoading: false});
        }
    },

    sendChat: async(prompt) => {
        try {
            const result = await instanceAxios.post('/api/chat', { prompt });
            return result.data.data;
        } catch (error) {
            console.error(error);
        }
    },

    AddChat: (message) => {
        set({ chat: [...get().chat, message]})
    }
}));

export default usePDFStore;