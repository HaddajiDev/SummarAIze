import { BsRobot } from "react-icons/bs"
import "./style.scss"
import { Button, Input } from "antd"
import { BsFillSendFill } from "react-icons/bs";

export default function ChatBot() {
    return(
        <div id="chatbot">
            <h1><BsRobot /> ChatBot</h1>
            <div className="chatContent">
                {Array(10).fill(0).map((_, i) => (
                    <div key={i}>
                        <div className="bot">
                            <span className="icon">
                                <BsRobot />
                            </span>
                            <p>Hello! How can I help you today?</p>
                        </div>
                        <div className="user">
                            <p>I need help with my homework, I need help with my homework, I need help with my homework</p>
                        </div>
                    </div>
            ))}
            </div>
            <div className="chatInput">
                <Input placeholder="Ask here" />
                <Button><BsFillSendFill /></Button>
            </div>
        </div>
    )
}