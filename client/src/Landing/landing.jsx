import './style.scss'
import { Button } from 'antd'
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

    const [open, setOpen] = useState(null);

    return (
        <>
            <div className='landing container'>
                <nav>
                    <div className="l-s">
                        <h1>Summar<span>AI</span>ze</h1>
                    </div>
                    <div className="c-s">
                        <a className='active'>Home</a>
                        <a>Features</a>
                        <a>Pricing</a>
                        <a>FAQs</a>
                        <a>Contact Us</a>
                    </div>
                    <div className="r-s">
                        <Button onClick={() => setOpen("login")}>Sign In</Button>
                        <Button onClick={() => setOpen("register")} type="primary">Sign Up</Button>
                    </div>
                </nav>
                <header>
                    <div className="l-s">
                        <h1>Revolutionize Your PDF Workflow with Summar<span>AI</span>ze</h1>
                        <p>🚀 Experience the future of document interaction today!</p>
                        <Button onClick={() => setOpen("register")} type="primary">Get Started Now</Button>
                    </div>
                    <div className="r-s">
                        <img src={HeaderSVG} alt="Header Illustration" />
                    </div>
                </header>
                <div className='intro'>
                    <div className='pf'>
                        <img src={FeatureSVG} alt="Features Overview" />
                    </div>
                    <div className='content'>
                        <h3>Supercharge Your PDF Experience with AI</h3>
                        <p>Say goodbye to tedious manual reading and summarization.</p>
                        <p>With Summar<span>AI</span>ze, you can interact with your documents, generate instant summaries, create quizzes, and uncover valuable insights—all powered by cutting-edge AI.</p>
                        <p>Whether you're a student, researcher, or professional, our platform is designed to enhance productivity and simplify your workflow.</p>
                        <Button onClick={() => setOpen("register")} type="primary">Discover More</Button>
                    </div>
                </div>
                <div className='feature'>
                    <h2>
                        Struggling with lengthy PDFs?
                        <br />
                        Summar<span>AI</span>ze has you covered!
                    </h2>
                    <div className='fts'>
                        <div className='item'>
                            <div className='icon'>
                                <img src={Feature1SVG} alt="Chat with PDFs" />
                            </div>
                            <h3>Chat with Your PDFs</h3>
                            <p>Ask questions and receive instant, accurate answers.</p>
                        </div>
                        <div className='item'>
                            <div className='icon'>
                                <img src={Feature2SVG} alt="Generate Summaries" />
                            </div>
                            <h3>Generate Summaries</h3>
                            <p>Extract key points in seconds.</p>
                        </div>
                        <div className='item'>
                            <div className='icon'>
                                <img src={Feature3SVG} alt="Create Quizzes" />
                            </div>
                            <h3>Create Quizzes</h3>
                            <p>Test your knowledge with AI-crafted quizzes.</p>
                        </div>
                        <div className='item'>
                            <div className='icon'>
                                <img src={Feature4SVG} alt="Discover Resources" />
                            </div>
                            <h3>Discover Resources</h3>
                            <p>Access topic-related links and references effortlessly.</p>
                        </div>
                        <div className='item'>
                            <div className='icon'>
                                <img src={Feature5SVG} alt="Edit & Enhance" />
                            </div>
                            <h3>Edit & Enhance</h3>
                            <p>Annotate, highlight, and modify your PDFs with ease.</p>
                        </div>
                    </div>
                </div>
                <div className='pricing'>
                    <div className='tit'>
                        <h2>
                            Transparent & Affordable Pricing
                        </h2>
                        <p>
                            Start for free or unlock premium features at a competitive price.
                            <br />
                            No hidden costs—just powerful tools to elevate your PDF experience.
                        </p>
                    </div>
                    <div className='ps'>
                        <div className='item'>
                            <h3>Basic Plan</h3>
                            <p>Free</p>
                            <ul>
                                <li><FaCircleCheck /> Upload up to 3 PDFs</li>
                                <li><FaCircleCheck /> Chat with PDFs</li>
                                <li><FaCircleCheck /> Basic AI Summarization</li>
                                <li><FaCircleCheck /> Quiz Generation</li>
                                <li><FaCircleCheck /> Extract Key Topics & Resources</li>
                                <li><FaCircleCheck /> Limited Cloud Storage</li>
                                <li><FaCircleCheck /> No PDF Deletion</li>
                            </ul>
                            <Button onClick={() => setOpen("register")} type="primary">Get Started</Button>
                        </div>
                        <div className='item'>
                            <h3>Premium Plan</h3>
                            <p>$10<span>/Month</span></p>
                            <ul>
                                <li><FaCircleCheck /> Unlimited PDF Uploads</li>
                                <li><FaCircleCheck /> Chat with PDFs</li>
                                <li><FaCircleCheck /> Advanced AI Summarization</li>
                                <li><FaCircleCheck /> Regenerate Summaries</li>
                                <li><FaCircleCheck /> Unlimited Quiz Generation</li>
                                <li><FaCircleCheck /> Full PDF Editing (Merge, Split, Convert & More)</li>
                                <li><FaCircleCheck /> Priority AI Processing</li>
                                <li><FaCircleCheck /> Ad-Free Experience & Priority Support</li>
                            </ul>
                            <Button onClick={() => setOpen("register")} type="primary">Upgrade Now</Button>
                        </div>
                    </div>
                </div>
                <Login open={open} setOpen={setOpen} />
                <Register open={open} setOpen={setOpen} />
            </div>
            <footer>©{new Date().getFullYear()} Summar<span>AI</span>ze. All rights reserved.</footer>
        </>
    )
}