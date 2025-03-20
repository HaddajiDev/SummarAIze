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
            <footer>©{new Date().getFullYear()} Summar<span>AI</span>ze. All rights reserved</footer>
        </>
    )
}