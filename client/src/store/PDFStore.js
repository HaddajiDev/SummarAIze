import {create} from "zustand";
import instanceAxios from "../lib/axios";

const usePDFStore = create((set,get)=>({
    pdfUrl: null,
    uploadLoading: false,
    summary: null,
    chat: [],
    replayLoading: false,
    resources : [],
    resourcesLoading: false,

    setPDFURL: (url) => set({pdfUrl:url}),

    clearPDF: () => set({pdfUrl:null}),

    uploadPDF: async (file) => {
        set({uploadLoading:true});
        // console.log(file);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await instanceAxios.post('/api/upload', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            // console.log(res.data);
            set({pdfUrl: res.data.url});
            set({summary: res.data.summary});
            get().fetchresource();
            // console.log(get().summary);
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            set({uploadLoading: false});
        }
    },

    sendChat: async(prompt) => {
        set({ replayLoading: true });
        try {
            const result = await instanceAxios.post('/api/chat', { prompt });
            return result.data.data;
        } catch (error) {
            console.error(error);
        } finally {
            set({ replayLoading: false });
        }
    },
    
    AddChat: (message) => {
        set({ chat: [...get().chat, message]})
    },
    
    fetchresource: async () => {
        set({resourcesLoading:true});
        try {
            const summary = get().summary;
            const result = await instanceAxios.post('/resources', { text: summary });
            // const results = await Promise.all(result.data.map(async (res) => {
            //     const img = await instanceAxios.get(`/resources/metadata?url=${encodeURIComponent(res.link)}`);
            //     res.cover = img.data;
            //     return res;
            // }));
            // set({resources:results});
            set({resources:result.data});
            console.log(result);
        } catch (error) {
            console.error("Error fetching resources:", error);
            return null;
        } finally {
            set({resourcesLoading:false});
        }
    },
}));

export default usePDFStore;