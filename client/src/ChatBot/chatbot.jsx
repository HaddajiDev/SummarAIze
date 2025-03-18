import { BsRobot } from "react-icons/bs";
import "./style.scss";
import { Button, Input } from "antd";
import { BsFillSendFill } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import usePDFStore from "../store/PDFStore";
import ReactMarkdown from "react-markdown";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Bot from "../assets/Chat bot-pana.svg";

export default function ChatBot() {
    const chats = usePDFStore(state => state.chat);
    const chatRef = useRef(null);
    const [message, setMessage] = useState("");
    const { sendChat, AddChat, replayLoading } = usePDFStore();

    useEffect(()=>{
        chatRef.current?.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: "smooth"
        });
    },[message,chats]);

    const handleSend = async () => {
        if (!message.trim()) return;
        AddChat({ sender: "user", content: message });
        setMessage("");
        try {
            const botResponse = await sendChat(message);
            AddChat({ sender: "bot", content: botResponse });
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <div id="chatbot">
            <h1><BsRobot /> ChatBot</h1>
            <div className="chatContent" ref={chatRef}>
                {chats.map((chat, i) => (
                    <div key={i}>
                        {chat.sender === "bot" ? (
                            <div className="bot">
                                <span className="icon"><BsRobot /></span>
                                <div className="cont"><ReactMarkdown>{chat.content}</ReactMarkdown></div>
                            </div>
                        ) : (
                            <div className="user">
                                <div className="cont">{chat.content}</div>
                            </div>
                        )}
                    </div>
                ))}
                {replayLoading && (
                    <div className="bot">
                        <span className="icon"><BsRobot /></span>
                        <div className="cont" style={{ width: "75px" }}>
                            <DotLottieReact
                                className="load"
                                src="https://lottie.host/4f004575-74b4-4a1a-9616-c34c9e07fc75/IPiTBaKelY.lottie"
                                loop
                                autoplay
                            />
                        </div>
                    </div>
                    
                )}
                {chats.length === 0 && (
                    <img className="botCov" src={Bot} />
                )}
            </div>
            <div className="chatInput">
                <Input 
                    placeholder="Ask here" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onPressEnter={handleSend}
                />
                <Button onClick={handleSend}><BsFillSendFill /></Button>
            </div>
        </div>
    );
}