import {create} from "zustand";

export const usePDFStore = create((set,get)=>({
    pdfUrl: null,
    setPDF: (url) => set({pdfUrl:url}),
    clearPDF: () => set({pdfUrl:null})
}))