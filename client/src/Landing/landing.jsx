import './style.scss'
import { Button, message, Spin } from 'antd'
import { FaCloudUploadAlt } from "react-icons/fa";
import usePDFStore from '../store/PDFStore';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const {pdfUrl,uploadLoading,uploadPDF} = usePDFStore();


    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if(file && file.size > 10000000){
            messageApi.open({
                type: 'error',
                content: 'File size is too large. Please upload a file less than 10MB',
            });
            return;
        }
        if (file && file.type === "application/pdf") {
            await uploadPDF(file);
            navigate('/view');
        } else {
            messageApi.open({
                type: 'error',
                content: 'Please upload a valid PDF file',
            });
        }
    };

    return (
        <>
            {contextHolder}
            <div id='landing'>
                <div className='content'>
                    <h1>Smart PDF Analyzer</h1>
                    <p>Upload a PDF and unlock insights instantly! Extract key topics, generate summaries, find related articles and videos, and even create quizzes—all powered by AI.</p>
                    <div className='upload'>
                        {uploadLoading ?(
                            <Spin />
                        ):(
                            <>
                                <FaCloudUploadAlt />
                                Select PDF File
                                <input type='file' accept="application/pdf" onChange={handleFileChange} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}