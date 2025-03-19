import './style.scss'
import { Button, message, Spin } from 'antd'
import { FaCloudUploadAlt } from "react-icons/fa";
import usePDFStore from '../store/PDFStore';
import { useNavigate } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Cov1 from "../assets/Visual data-pana.svg";
import Nav from '../Nav/nav';
import Register from '../Auth/register';
import Login from '../Auth/login';
import { useState } from 'react';

import { FaCircleCheck } from "react-icons/fa6";
import HeaderSVG from "../assets/header.svg"
import FeatureSVG from "../assets/feature.svg"
import Feature1SVG from "../assets/ft1.svg"
import Feature2SVG from "../assets/ft2.svg"
import Feature3SVG from "../assets/ft3.svg"
import Feature4SVG from "../assets/ft4.svg"
import Feature5SVG from "../assets/ft5.svg"

export default function Landing() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const {uploadLoading,uploadPDF} = usePDFStore();
    const [open, setOpen] = useState(null);


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
        <div className='landing container'>
            {contextHolder}
            {/* <div id='landing'>
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
            </div> */}
            <nav>
                <div className="l-s">
                    <h1>Summar<span>AI</span>ze</h1>
                </div>
                <div className="c-s">
                    <a className='active'>Home</a>
                    <a>Feature</a>
                    <a>Pricing</a>
                    <a>Questions</a>
                    <a>Contact us</a>
                </div>
                <div className="r-s">
                    <Button onClick={()=>setOpen("login")}>Sign In</Button>
                    <Button onClick={()=>setOpen("register")} type="primary">Sign up</Button>
                </div>
            </nav>
            <header>
                <div className="l-s">
                    <h1>Unlock the Power of Your PDFs with Summar<span>AI</span>ze</h1>
                    <p>🚀 Transform the way you interact with PDFs today!</p>
                    <Button onClick={()=>setOpen("register")} type="primary">Get Started</Button>
                </div>
                <div className="r-s">
                    <img src={HeaderSVG} />
                </div>
            </header>
            <div className='intro'>
                <div className='pf'>
                    <img src={FeatureSVG} />
                </div>
                <div className='content'>
                    <h3>Enhance Your PDF Experience with AI</h3>
                        <p>Stop wasting time manually reading and summarizing PDFs.</p>
                        <p>With Summar<span>AI</span>ze, you can chat with your documents, generate instant summaries, create quizzes, and discover relevant resources—all with AI-powered assistance.</p>
                        <p>Whether you're a student, researcher, or professional, our platform helps you boost productivity and  streamline your workflow.</p>
                    <Button onClick={()=>setOpen("register")}  type="primary">Explore Now</Button>
                </div>
            </div>
            <div className='feature'>
                <h2>
                    Tired of scrolling through long PDFs?
                    <br />
                    With Summar<span>AI</span>ze you can
                </h2>
                <div className='fts'>
                    <div className='item'>
                        <div className='icon'>
                            <img src={Feature1SVG} />
                        </div>
                        <h3>Chat with Your PDFs</h3>
                        <p>Ask questions and get instant answers.</p>
                    </div>
                    <div className='item'>
                        <div className='icon'>
                            <img src={Feature2SVG} />
                        </div>
                        <h3>Generate Summaries</h3>
                        <p>Get concise takeaways in seconds.</p>
                    </div>
                    <div className='item'>
                        <div className='icon'>
                            <img src={Feature3SVG} />
                        </div>
                        <h3>Create Quizzes</h3>
                        <p>Test your understanding with AI-generated quizzes.</p>
                    </div>
                    <div className='item'>
                        <div className='icon'>
                            <img src={Feature4SVG} />
                        </div>
                        <h3>Discover Resources</h3>
                        <p>Get topic-related links and references.</p>
                    </div>
                    <div className='item'>
                        <div className='icon'>
                            <img src={Feature5SVG} />
                        </div>
                        <h3>Edit & Enhance</h3>
                        <p>Annotate, highlight, and modify your PDFs effortlessly.</p>
                    </div>
                </div>
            </div>
            <div className='pricing'>
                <div className='tit'>
                    <h2>
                        Simple & Affordable Pricing
                    </h2>
                    <p>
                        Get started for free or unlock premium features at a low price.
                        <br />
                        No hidden fees—just powerful tools to enhance your PDF experience.
                    </p>
                </div>
                <div className='ps'>
                    <div className='item'>
                        <h3>Basic Plan</h3>
                        <p>Free</p>
                        <ul>
                            <li><FaCircleCheck /> Get started for free or unlock</li>
                            <li><FaCircleCheck /> Get started for free or unlock</li>
                            <li><FaCircleCheck /> Get started for free or unlock</li>
                        </ul>
                        <Button onClick={()=>setOpen("register")} type="primary">Get Started</Button>
                    </div>
                    <div className='item'>
                        <h3>Premium Plan</h3>
                        <p>$10</p>
                        <ul>
                            <li><FaCircleCheck /> Get started for free or unlock</li>
                            <li><FaCircleCheck /> Get started for free or unlock</li>
                            <li><FaCircleCheck /> Get started for free or unlock</li>
                        </ul>
                        <Button onClick={()=>setOpen("register")} type="primary">Get Started</Button>
                    </div>
                </div>
            </div>
            <Login open={open} setOpen={setOpen} />
            <Register open={open} setOpen={setOpen} />
        </div>
    )
}