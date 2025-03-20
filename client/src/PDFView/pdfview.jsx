import { memo, useEffect, useRef, useState } from "react";
import "./style.scss"
import WebViewer from '@pdftron/webviewer';
import usePDFStore from "../store/PDFStore";
import { BsRobot } from "react-icons/bs";


const PDFView = () => {
    const viewerRef = useRef(null);
    const pdfUrl = usePDFStore((state)=>state.pdfUrl);
    const instanceRef = useRef(null);
    const setSelectedText = usePDFStore((state)=>state.setSelectedText);
    const [popup, setPopup] = useState({ show: false, x: 0, y: 0});
    const [selectedTextState, setSelectedTextState] = useState(null);

    useEffect(() => {
        WebViewer({
            path: '/webview',
            initialDoc: pdfUrl,
            // initialDoc: 'https://res.cloudinary.com/db0guoc9m/image/upload/v1742256878/a8m72fwwtrsx8frllzld.pdf',
            isReadOnly: true,
            licenseKey: 'demo:1741964115564:615810ee03000000004151de0f7af66a8c25176023784464465fdc7265',
        }, viewerRef.current)
        .then((instance) => {
            instanceRef.current = instance.Core;
            const { documentViewer, Tools } = instance.Core;

            const tool = documentViewer.getTool(Tools.ToolNames.TEXT_SELECT);
            // tool.addEventListener("selectionComplete", async(_, allQuads) => {
            //     let selectedText = "";
            //     let firstQuad = null;

            //     Object.keys(allQuads).forEach((pageNum) => {
            //         // console.log("pageNum",pageNum);
            //         const text = documentViewer.getSelectedText(pageNum);
            //         selectedText += text;
            //         if (!firstQuad && allQuads[pageNum].length > 0) {
            //             firstQuad = allQuads[pageNum][0];
            //             // console.log(pageNum, allQuads[pageNum][0]);
            //         }
            //     });

            //     // console.log("allQuads ",allQuads);
            //     console.log("firstQuad ",firstQuad);
            //     // console.log(selectedText);
            //     setSelectedText(selectedText);

            //     if (selectedText&&firstQuad) {
            //         // console.log("this1");
            //         // const pageNumber = documentViewer.getCurrentPage();
            //         // console.log("pageNumber",pageNumber);
            //         // const displayModeManager = documentViewer.getDisplayModeManager();
            //         // const screenCoords = displayModeManager.convertPagePointToScreenPoint(
            //         //     firstQuad.x1,
            //         //     firstQuad.y1,
            //         //     pageNumber
            //         // );
            //         // console.log("pageCoordinates",screenCoords);
            //         setPopup({
            //             show: true,
            //             x: firstQuad.x1 + 10,
            //             y: firstQuad.y1 - 20,
            //         });
            //     } else {
            //         // console.log("this2");
            //         setPopup({ show: false, x: 0, y: 0});
            //     }
            // });
            tool.addEventListener("selectionComplete", (_, allQuads) => {
                let selectedText = "";
                let firstQuad = null;

                Object.keys(allQuads).forEach((pageNum) => {
                    const text = documentViewer.getSelectedText(pageNum);
                    selectedText += text;
                    if (!firstQuad && allQuads[pageNum].length > 0) {
                        firstQuad = allQuads[pageNum][0];
                    }
                });

                if (selectedText && firstQuad) {
                    // setSelectedText(selectedText);
                    setSelectedTextState(selectedText);
                    setPopup({
                        show: true,
                        x: firstQuad.x1 + 10,
                        y: firstQuad.y1 - 20,
                    });
                } else {
                    // setSelectedText(null);
                    setSelectedTextState(null);
                    setPopup({ show: false, x: 0, y: 0 });
                }
            });
            documentViewer.addEventListener('mouseLeftUp', () => {
                const selectedText = documentViewer.getSelectedText();
                if (!selectedText) {
                    setPopup({ show: false, x: 0, y: 0 });
                    // setSelectedText(null);
                }
            });

        });
    }, [pdfUrl]);

    const handleSelectedText = () => {
        if(selectedTextState){
            setSelectedText(selectedTextState);
        }
        const { documentViewer } = instanceRef.current;
        documentViewer.clearSelection();
        setPopup({ show: false, x: 0, y: 0 });
    }

    return(
        <div id="pdf-view">
            <div className="content">
                <div className="webviewer" ref={viewerRef} style={{ height: '100%' }}></div>
                {popup.show && (
                    <div className="askAI" style={{ left: popup.x+80, top: popup.y-30 }} onClick={handleSelectedText}>
                        Ask AI
                    </div>
                )}
            </div>
        </div>
    )
}

export default memo(PDFView);