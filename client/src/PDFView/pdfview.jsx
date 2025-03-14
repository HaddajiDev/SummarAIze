import { useEffect, useRef } from "react";
import "./style.scss"
import WebViewer from '@pdftron/webviewer';

export default function PDFView() {
    const viewerRef = useRef(null);

    useEffect(() => {
        WebViewer(
        {
            path: '/dist',
            initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
            isReadOnly: true,
            licenseKey: 'demo:1741964115564:615810ee03000000004151de0f7af66a8c25176023784464465fdc7265',
        },
        viewerRef.current
        ).then((instance) => {
            const { documentViewer, annotationManager } = instance.Core;
        });
    }, []);


    return(
        <div id="pdf-view">
            <div className="content">
                <div className="webviewer" ref={viewerRef} style={{ height: '100%' }}></div>
            </div>
        </div>
    )
}