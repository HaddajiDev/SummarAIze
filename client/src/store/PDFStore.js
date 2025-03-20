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
    quizes: [],
    quizesLoading: false,
    selectedText: null,
    pdfId: null,

    setPDFURL: (url) => set({pdfUrl:url}),

    clearPDF: () => set({pdfUrl:null}),

    uploadPDF: async (file, userId) => {
        set({uploadLoading:true});
        // console.log(file);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await instanceAxios.post(`/api/upload?userId=${userId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            // console.log(res.data);
            set({pdfUrl: res.data.url});
            set({summary: res.data.summary});
            set({pdfId: res.data.pdfId});
            set({chat: null});
            get().fetchresource(res.data.pdfId);
            get().handleFetchQuizes(res.data.pdfId);
            // console.log(get().summary);
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            set({uploadLoading: false});
        }
    },

    setSelectedText: (text) => {
        set({selectedText:text});
    },

    sendChat: async(prompt, pdfId) => {
        set({ replayLoading: true });
        try {
            const result = await instanceAxios.post('/api/chat', { prompt, pdfId });
            return result.data.data;
        } catch (error) {
            console.error(error);
        } finally {
            set({ replayLoading: false });
        }
    },
    
    AddChat: (message) => {
        set({ chat: [...get().chat, message]});
    },
    
    fetchresource: async (pdfId) => {
        set({resourcesLoading:true});
        try {
            const summary = get().summary;
            const result = await instanceAxios.post('/resources', { text: summary, pdfId });
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
    
    handleFetchQuizes: async (pdfId) => {
        set({quizesLoading:true});
        try {
            const response = await instanceAxios.post('/quiz', { text: get().summary, pdfId });
            set({quizes:response.data});
        } catch (err) {
            console.error(err);
        } finally {
            set({quizesLoading:false});
        }
    },

    getOneHistory: async(pdfId) => {
        try {
            const result = await instanceAxios.get(`/api/history/${pdfId}`);
            console.log(result.data);
            set({pdfUrl: result.data.history.pdfLink});
            set({summary: result.data.history.summary});
            set({chat: result.data.history.messages.slice(2)});
            set({quizes: result.data.history.quizs});
            set({resources: result.data.history.resources});
            set({pdfId: result.data.history.pdfId})
        } catch (error) {
            console.log(error);
        }
    }
}));

export default usePDFStore;