import { useEffect, useRef, useState } from "react";
import "./style.scss"
import WebViewer from '@pdftron/webviewer';
import usePDFStore from "../store/PDFStore";


export default function PDFView() {
    const viewerRef = useRef(null);
    const pdfUrl = usePDFStore((state)=>state.pdfUrl);
    const [popup, setPopup] = useState({ show: false, x: 0, y: 0, text: "" });

    useEffect(() => {
        WebViewer({
            path: '/webview',
            initialDoc: pdfUrl,
            // initialDoc: 'https://res.cloudinary.com/db0guoc9m/image/upload/v1742256878/a8m72fwwtrsx8frllzld.pdf',
            isReadOnly: true,
            licenseKey: 'demo:1741964115564:615810ee03000000004151de0f7af66a8c25176023784464465fdc7265',
        }, viewerRef.current)
        // .then((instance) => {
        //     const docViewer = instance.Core.documentViewer; // Use Core API

        //     docViewer.addEventListener("documentLoaded", () => {
        //         const textSelectTool = docViewer.getTool(instance.Core.Tools.ToolNames.TEXT_SELECT);

        //         if (!textSelectTool) {
        //             console.error("Text selection tool not found.");
        //             return;
        //         }

        //         textSelectTool.addEventListener("textSelected", (selectedText, quads) => {
        //             if (selectedText && quads.length > 0) {
        //                 const pageNumber = quads[0].pageNumber;
        //                 const { x1, y1 } = quads[0];

        //                 // Convert page coordinates to viewer coordinates
        //                 const { x, y } = docViewer.getDocument().getViewerCoordinates(pageNumber, { x: x1, y: y1 });

        //                 setPopup({
        //                     show: true,
        //                     x: x,
        //                     y: y - 40, // Adjust position
        //                     text: selectedText,
        //                 });
        //             }
        //         });
        //     });
        // }).catch((error) => console.error("PDFTron failed to initialize:", error));
    }, [pdfUrl]);

    return(
        <div id="pdf-view">
            
            <div className="content">
                <div className="webviewer" ref={viewerRef} style={{ height: '100%' }}></div>
                {popup.show && (
                    <div
                    style={{
                        position: "absolute",
                        top: popup.y,
                        left: popup.x,
                        background: "white",
                        padding: "8px",
                        boxShadow: "0px 0px 5px rgba(0,0,0,0.3)",
                        borderRadius: "5px",
                        zIndex: 1000,
                    }}
                    >
                    <p>Selected Text: {popup.text}</p>
                    <button onClick={() => alert(popup.text)}>Copy</button>
                    <button onClick={() => setPopup({ ...popup, show: false })}>Close</button>
                    </div>
                )}
            </div>
        </div>
    )
}