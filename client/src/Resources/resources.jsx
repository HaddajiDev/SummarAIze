import "./style.scss"
import { FaRegCirclePlay } from "react-icons/fa6";
import { LuTextSearch } from "react-icons/lu";
import usePDFStore from "../store/PDFStore";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Resources() {
    const resources = usePDFStore(state=>state.resources);
    const resourcesLoading = usePDFStore(state=>state.resourcesLoading);
    return(
        <div id="resources">
            <h1><LuTextSearch /> Resources</h1>
            <div className="resources-content">
                {resourcesLoading && (
                    <DotLottieReact
                        className="load"
                        src="https://lottie.host/4f004575-74b4-4a1a-9616-c34c9e07fc75/IPiTBaKelY.lottie"
                        loop
                        autoplay
                    />
                )}
                {/* {!resourcesLoading && resources?.map((resource, i) => {
                    if(resource.type!="image"){
                        return (
                            <a href={resource?.link} className="item" key={i}>
                                <div className={`img ${resource?.type=="video" ?"vid" :""}`}>
                                    {resource?.type=="video" && <FaRegCirclePlay />}
                                    <img
                                        src={resource?.cover}
                                        alt={resource?.title}
                                    />
                                </div>
                                <p>{resource?.title}</p>
                            </a>
                        )
                    } 
                    if(resource.type=="image"){
                        return (
                            <div className="image" key={i}>
                                <img src={resource?.link} alt={resource?.title} />
                                <p>{resource?.title}</p>
                            </div>
                        )
                    }
                })} */}
                {!resourcesLoading && resources?.map((resource, i) => (
                    <a href={resource?.link} className="item" key={i} target="_blank">
                        <div className={`img`}>
                            <img
                                src={resource?.cover || "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="}
                                alt={resource?.title}
                            />
                        </div>
                        <p>{resource?.title}</p>
                    </a>
                ))}
            </div>
        </div>
    )
}