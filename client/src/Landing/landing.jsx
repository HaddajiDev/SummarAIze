import './style.scss'
import { useState } from 'react';
import { Button, message, Spin } from 'antd'
import { FaCloudUploadAlt } from "react-icons/fa";
import { usePDFStore } from '../store/PDFStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Landing() {
    const navigate = useNavigate();
    const setPdf = usePDFStore((state) => state.setPDF);
    const [uploadLoading, setUploadLoading] = useState(false);


    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            // console.log('Selected file:', file);
            await uploadFile(file);
        }
        // message.error("Please upload a PDF file");
    };

    const uploadFile = async (file) => {
        // console.log("Uploading file...");
        // console.log(file);
        setUploadLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/db0guoc9m/upload', formData);
            // console.log(response.data);
            setPdf(response.data.secure_url);
            // message.success('File uploaded successfully.');
            setTimeout(()=>navigate('/view'),500);
        } catch (error) {
            console.log(error);
            console.error('Error uploading file:', error);
            alert('Failed to upload file.');
        } finally {
            setUploadLoading(false);
        }
    };

    return (
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
    )
}