import "./style.scss"
import { MdOutlineQuiz } from "react-icons/md";
import { Button, Radio } from 'antd';

export default function Quiz() {
    return(
        <div id="quiz">
            <h1 className="title"><MdOutlineQuiz /> Quiz</h1>
            <div className="quiz_content">
                {Array(9).fill().map((_, i) => (
                    <div className="qz">
                        <h2>Question {i+1}</h2>
                        <p>What is the capital of France?</p>
                        <Radio.Group
                            options={[
                                { value: 1, label: 'Option A' },
                                { value: 2, label: 'Option B' },
                                { value: 3, label: 'Option C' },
                                { value: 4, label: 'Option D' },
                            ]}
                        />
                    </div>    
                ))}
            </div>
            <div className="btns">
                <Button type="primary">Generate Other Quiz</Button>
                <Button type="primary">Submit</Button>
            </div>
        </div>
    )
}