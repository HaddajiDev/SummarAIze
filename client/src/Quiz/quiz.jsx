import "./style.scss";
import { MdOutlineQuiz } from "react-icons/md";
import { Button, Radio, Spin } from 'antd';
import { useState } from "react";
import usePDFStore from "../store/PDFStore";
import ReactMarkdown from "react-markdown";

export default function Quiz() {
    const { handleFetchQuizes, quizes, quizesLoading } = usePDFStore();
    const [selectedAnswers, setSelectedAnswers] = useState({});

    const handleAnswerChange = (questionIndex, value) => {
        setSelectedAnswers(prev => ({...prev,[questionIndex]: value}));
    };

    const handleSubmitQuizes = () => {
        let score = 0;
        quizes.forEach((quiz, index) => {
            if (selectedAnswers[index] === quiz.answer) {
                score++;
            }
        });
        alert(`Your Score: ${score}/${quizes.length}`);
        setSelectedAnswers({});
    };

    return (
        <div id="quiz">
            <h1 className="title"><MdOutlineQuiz /> Quiz</h1>
            <div className="quiz_content">
                {quizes.map((quiz, i) => (
                    <div className="qz" key={i}>
                        <h2>Question {i + 1}</h2>
                        <p>{quiz.question}</p>
                        <Radio.Group
                            onChange={(e) => handleAnswerChange(i, e.target.value)}
                            value={selectedAnswers[i]}
                            disabled={quizesLoading}
                        >
                            {quiz.options.map((option, optionIndex) => (
                                <Radio key={optionIndex} value={optionIndex}>
                                    <ReactMarkdown>{option}</ReactMarkdown>
                                </Radio>
                            ))}
                        </Radio.Group>
                    </div>
                ))}
            </div>
            <div className="btns">
                <Button type="primary" onClick={()=>{
                    handleFetchQuizes();
                    setSelectedAnswers({});
                }} loading={quizesLoading}>
                    {quizesLoading ? "": "Other Quiz"}
                </Button>
                <Button type="primary" 
                    onClick={handleSubmitQuizes} 
                    disabled={quizesLoading||Object.entries(selectedAnswers).length<quizes.length}
                >
                    Check
                </Button>
            </div>
        </div>
    );
}