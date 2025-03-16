import "./style.scss"
import { PiFiles } from "react-icons/pi"
import ReactMarkdown from "react-markdown";
import usePDFStore from "../store/PDFStore";
import { useEffect, useState } from "react";

export default function Summarize() {
    const summary = usePDFStore((state)=>state.summary);
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        console.log(summary);
        setTimeout(()=>{
            setLoading(false);
        },1500);
    },[summary])
    return(
        <div id="summarize">
            <h1 className="title"><PiFiles /> Summarize</h1>
            <div className="sumContent prose">
                {loading 
                    ?<div className="loading">Generating Summary...</div> 
                    :<ReactMarkdown>{summary}</ReactMarkdown>
                }
            </div>
        </div>
    )
}