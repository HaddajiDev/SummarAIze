import Nav from "../Nav/nav";
import usePDFStore from "../store/PDFStore";
import { Button, Empty, message, Popconfirm, Typography } from 'antd'
import { FaCloudUploadAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Cov1 from "../assets/Visual data-pana.svg";
import { AiOutlineFilePdf } from "react-icons/ai";
import { TbFileShredder } from "react-icons/tb";
import { TbFileReport } from "react-icons/tb";
import useHistoryStore from "../store/History";
import { useEffect, useState } from "react";
import useAuthStore from "../store/AuthStore";
import { formatDistance } from 'date-fns';

import SvgLogo from "../assets/PDF_file_icon.png";


// Dropzone.options.recommendationDiv = {
//     acceptedFiles: 'pdf/*'
// };

export default function Home() {
    const user = useAuthStore(state=>state.user);
    const {uploadLoading,uploadPDF, getOneHistory} = usePDFStore();
    const history = useHistoryStore(state => state.history);
    const getHistory = useHistoryStore(state=>state.getHistory);
    const deleteHistory = useHistoryStore(state=>state.deleteHistory);
    const navigate = useNavigate();
    const [showError, setShowError] = useState(null);

    const handleFileChange = async (file) => {
        setShowError(null);
        if(user?.plan === "free" && user?.numberOfDocuments >= 3) {
            setShowError("You have reached the limit of 3 documents for free plan. Please upgrade to premium plan");
            return;
        }
        if (file && file.type === "application/pdf") {
            if(file.size > 2000000 && user.plan === "free") {
                setShowError("File size exceeds 2MB limit for free plan. Please upgrade to premium plan");
                return;
            }
            await uploadPDF(file, user.id);
            navigate('/view');
        } else {
            message.error("Please upload a valid PDF file")
        }
    };

    useEffect(() => {
        getHistory(user.id);
    }, [user.id, getHistory]);

    const handleView = async(pdfId) => {
        await getOneHistory(pdfId);
        navigate('/view');
    }

    const handleDeletePDF = async(pdfId) => {
        if(user?.plan === "free") {
            setShowError("You need to upgrade to premium plan to delete the PDF");
            return;
        }
        await deleteHistory(pdfId);
        getHistory(user.id);
    }

    return (
        <div id="home">
            <Nav />
            <div className="content">
                <div className='upload'>
                    <Dropzone onDrop={files => handleFileChange(files[0])} accept={['.pdf']} disabled={uploadLoading}>
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
                                        <p>
                                            Drag and drop a PDF file here, or click to select file
                                            Max file size 2MB for free plan
                                            or upgrade to a Premium Plan
                                            {/* <Button>Premium Plan</Button> */}
                                        </p>
                                    </div>
                                    <div className={`upLoading ${uploadLoading ? 'loading' : ''}`}>
                                        <DotLottieReact
                                            // src="https://lottie.host/fd442003-9ac5-4343-b5ac-ed8596828375/rgNdupYMCS.lottie"
                                            src="https://lottie.host/a9c91675-983c-4130-a44a-209226e61b18/VGTLoI8akL.lottie"
                                            loop
                                            autoplay
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </Dropzone>
                    {showError && (
                        <div className="upload-error">
                            <p className="error">{showError}</p>
                            <Button color="primary" variant="dashed">Upgrade now</Button>
                        </div>
                    )}
                </div>
                <div className="hist">
                    <h3>Recent Uploads</h3>
                    <div className="items">
                        {history && history.length !== 0 ? history.map((item,idx) => (
                            <div className="item" key={idx}>
                                <img src={SvgLogo} />                                                    
                                <p><AiOutlineFilePdf /> {item?.pdfName}</p>
                                <p><TbFileShredder /> {item?.pdfSize}</p>
                                <p><TbFileReport /> {formatDistance(new Date(item?.createdAt), new Date(), { addSuffix: true }).replace("about ", "")}</p>
                                <div className="opt">
                                    <Button color="primary" variant="dashed" onClick={() => handleView(item?.pdfId)}>View</Button>
                                    <Popconfirm
                                        title="Delete the PDF"
                                        description="Are you sure to delete this PDF?"
                                        onConfirm={()=>{}}
                                        onCancel={()=>{}}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button color="danger" variant="dashed" onClick={()=>handleDeletePDF(item?.pdfId)}>Delete</Button>
                                    </Popconfirm>
                                </div>
                            </div>
                        )) : 
                            <Empty 
                                description={
                                    <Typography.Text>
                                        No recent uploads
                                    </Typography.Text>
                                }
                            />
                        }
                    </div>
                    
                </div>
            </div>
        </div>
    )
}