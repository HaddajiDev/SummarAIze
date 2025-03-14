import "./style.scss"
import { PiFiles } from "react-icons/pi"
import ReactMarkdown from "react-markdown";

export default function Summarize() {
    const markdownContent = `# AI Summary
- **Topic:** React Markdown  
- **Usage:** Render AI-generated Markdown in a website  
- **Library:** react-markdown`;

    return(
        <div id="summarize">
            <h1 className="title"><PiFiles /> Summarize</h1>
            <div className="sumContent prose">
                <ReactMarkdown>{markdownContent}
                </ReactMarkdown>
            </div>
        </div>
    )
}