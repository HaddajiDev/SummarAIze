import { BsRobot } from "react-icons/bs";
import "./style.scss";
import { Button, Input } from "antd";
import { BsFillSendFill } from "react-icons/bs";
import { useState } from "react";
import usePDFStore from "../store/PDFStore";
import ReactMarkdown from "react-markdown";

export default function ChatBot() {
    const chats = usePDFStore(state => state.chat);
    const [message, setMessage] = useState("");
    const { sendChat, AddChat } = usePDFStore();


    const handleSend = async () => {
        if (!message.trim()) return;

        AddChat({ sender: "user", content: message });
        
        try {
            const botResponse = await sendChat(message);
            AddChat({ sender: "bot", content: botResponse });
        } catch (error) {
            console.error("Failed to send message:", error);
        }
        
        setMessage("");
    };

    return (
        <div id="chatbot">
            <h1><BsRobot /> ChatBot</h1>
            <div className="chatContent">
                {chats.map((chat, i) => (
                    <div key={i}>
                        {chat.sender === "bot" ? (
                            <div className="bot">
                                <span className="icon"><BsRobot /></span>
                                <p><ReactMarkdown>{chat.content}</ReactMarkdown></p>
                            </div>
                        ) : (
                            <div className="user">
                                <p>{chat.content}</p>
                            </div>
                        )}
                    </div>
                ))}
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