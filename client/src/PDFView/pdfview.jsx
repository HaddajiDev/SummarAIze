import { useEffect, useRef } from "react";
import "./style.scss"
import WebViewer from '@pdftron/webviewer';
import usePDFStore from "../store/PDFStore";


export default function PDFView() {
    const viewerRef = useRef(null);
    const pdfUrl = usePDFStore((state)=>state.pdfUrl);

    useEffect(() => {
        if (!pdfUrl) return;
        WebViewer({
            path: '/webview',
            initialDoc: pdfUrl,
            isReadOnly: true,
            licenseKey: 'demo:1741964115564:615810ee03000000004151de0f7af66a8c25176023784464465fdc7265',
        }, viewerRef.current);
    }, [pdfUrl]);

    return(
        <div id="pdf-view">
            <div className="content">
                <div className="webviewer" ref={viewerRef} style={{ height: '100%' }}></div>
            </div>
        </div>
    )
}