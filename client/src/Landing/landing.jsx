import './style.scss'
import { Button, message, Spin } from 'antd'
import { FaCloudUploadAlt } from "react-icons/fa";
import usePDFStore from '../store/PDFStore';
import { useNavigate } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Cov1 from "../assets/Visual data-pana.svg";

export default function Landing() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const {uploadLoading,uploadPDF} = usePDFStore();


    const handleFileChange = async (file) => {
        // const file = event.target.files[0];
        if(file && file.size > 2000000){
            messageApi.open({
            type: 'error',
            content: 'File size is too large. Please upload a file less than 2MB',
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
                        <Dropzone onDrop={files => handleFileChange(files[0])} disabled={uploadLoading}>
                            {({getRootProps, getInputProps}) => (
                                <div className="container-upload">
                                    <div
                                        {...getRootProps({
                                        className: 'dropzone',
                                        onDrop: event => event.stopPropagation()
                                        })}
                                    >
                                        <div className={`upload-btn ${uploadLoading ? 'loading' : ''}`}>
                                            <input {...getInputProps()} />
                                            <FaCloudUploadAlt />
                                        </div>
                                        <div className={`upLoading ${uploadLoading ? 'loading' : ''}`}>
                                            <DotLottieReact
                                                src="https://lottie.host/fd442003-9ac5-4343-b5ac-ed8596828375/rgNdupYMCS.lottie"
                                                loop
                                                autoplay
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Dropzone>
                    </div>
                </div>
                {/* <img className='img1' src={Cov1} alt='cover' /> */}
            </div>
        </>
    )
}