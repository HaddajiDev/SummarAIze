import "./style.scss"
import { PiFiles } from "react-icons/pi"
import ReactMarkdown from "react-markdown";
import usePDFStore from "../store/PDFStore";
import { useEffect, useState } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Summarize() {
    const summary = usePDFStore((state)=>state.summary);
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        setTimeout(()=>{
            setLoading(false);
        },1500);
    },[])
    return(
        <div id="summarize">
            <h1 className="title"><PiFiles /> Summarize</h1>
            <div className="sumContent prose">
                {loading 
                    ?<div className="loading">
                        <DotLottieReact
                            className="load"
                            src="https://lottie.host/4f004575-74b4-4a1a-9616-c34c9e07fc75/IPiTBaKelY.lottie"
                            loop
                            autoplay
                        />
                    </div>
                    :<ReactMarkdown>{summary}</ReactMarkdown>
                }
            </div>
        </div>
    )
}