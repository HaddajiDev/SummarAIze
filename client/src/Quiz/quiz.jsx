import "./style.scss";
import { MdOutlineQuiz } from "react-icons/md";
import { Button, Radio } from 'antd';
import { useEffect, useRef, useState } from "react";
import instanceAxios from "../lib/axios";
import usePDFStore from "../store/PDFStore";

export default function Quiz() {
    const [quizes, setQuizes] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const formRef = useRef(null);
    const { summary } = usePDFStore();

    const handleFetchQuizes = async () => {
        setLoading(true);
        try {
            const response = await instanceAxios.post('/quiz', { text: summary });
            setQuizes(response.data);
            setSelectedAnswers({});
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(()=>{
        handleFetchQuizes();
    },[])

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
        formRef.current?.reset();
        setSelectedAnswers({});
    };

    return (
        <div id="quiz">
            <h1 className="title"><MdOutlineQuiz /> Quiz</h1>
            <div className="quiz_content" ref={formRef}>
                {quizes.map((quiz, i) => (
                    <div className="qz" key={i}>
                        <h2>Question {i + 1}</h2>
                        <p>{quiz.question}</p>
                        <Radio.Group
                            onChange={(e) => handleAnswerChange(i, e.target.value)}
                            value={selectedAnswers[i]}
                        >
                            {quiz.options.map((option, optionIndex) => (
                                <Radio key={optionIndex} value={optionIndex}>
                                    {option}
                                </Radio>
                            ))}
                        </Radio.Group>
                    </div>
                ))}
            </div>
            <div className="btns">
                <Button type="primary" onClick={handleFetchQuizes} loading={loading}>
                    Generate Other Quiz
                </Button>
                <Button type="primary" onClick={handleSubmitQuizes}>
                    Submit
                </Button>
            </div>
        </div>
    );
}