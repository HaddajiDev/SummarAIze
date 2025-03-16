import "./style.scss"
import PDFView from "../PDFView/pdfview"
import ChatBot from "../ChatBot/chatbot"
import {Tabs} from "antd"
import { BsRobot } from "react-icons/bs";
import { PiFiles } from "react-icons/pi";
import { MdOutlineQuiz } from "react-icons/md";
import { LuTextSearch } from "react-icons/lu";
import Resources from "../Resources/resources";
import Summarize from "../Summarize/Summarize";
import Quiz from "../Quiz/quiz";
import { useState } from "react";



export default function Home() {
    const [option, setOption] = useState("summarize");
    return(
        <div id="home">
            <PDFView />
            <div className="r-p">
                {option=="chatbot"&&<ChatBot />}
                {option=="resources"&&<Resources />}
                {option=="summarize"&&<Summarize />}
                {option=="quiz"&&<Quiz />}
            </div>
            <div className="menu">
                <div className="items">
                    <p className={option=="chatbot" ?"active" :""} onClick={() => setOption("chatbot")}>
                        <BsRobot />
                        ChatBot
                    </p>
                    <p className={option=="resources" ?"active" :""} onClick={() => setOption("resources")}>
                        <LuTextSearch />
                        Resources
                    </p>
                    <p className={option=="summarize" ?"active" :""} onClick={() => setOption("summarize")}>
                        <PiFiles />
                        Summary
                    </p>
                    <p className={option=="quiz" ?"active" :""} onClick={() => setOption("quiz")}>
                        <MdOutlineQuiz />
                        Quiz
                    </p>
                </div>
            </div>
        </div>
    )
}