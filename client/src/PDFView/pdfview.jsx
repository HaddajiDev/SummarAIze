import { useEffect, useRef } from "react";
import "./style.scss"
import WebViewer from '@pdftron/webviewer';
import { usePDFStore } from "../store/PDFStore";

// import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
// import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

// GlobalWorkerOptions.workerSrc = pdfWorker;


export default function PDFView() {
    const viewerRef = useRef(null);
    const pdfUrl = usePDFStore((state)=>state.pdfUrl);

    console.log(pdfUrl);

    useEffect(() => {
        if (!pdfUrl) return;
        WebViewer(
            {
                path: '/dist',
                // initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
                initialDoc: pdfUrl,
                isReadOnly: true,
                licenseKey: 'demo:1741964115564:615810ee03000000004151de0f7af66a8c25176023784464465fdc7265',
            }, viewerRef.current);
    }, [pdfUrl]);

    // useEffect(() => {
    //     getDocument(PDFUploaded).promise.then(pdf => {
    //         pdf.getPage(1).then(page => {
    //             const viewport = page.getViewport({ scale: 1 });
    //             const canvas = viewerRef.current;
    //             const context = canvas.getContext('2d');
    //             canvas.width = viewport.width;
    //             canvas.height = viewport.height;
    //             page.render({ canvasContext: context, viewport });
    //         });
    //     });
    // }, [PDFUploaded]);


    return(
        <div id="pdf-view">
            <div className="content">
                <div className="webviewer" ref={viewerRef} style={{ height: '100%' }}></div>
                {/* <canvas ref={viewerRef} /> */}
            </div>
        </div>
    )
}