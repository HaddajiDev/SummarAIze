import "./style.scss"
import { FaRegCirclePlay } from "react-icons/fa6";
import { LuTextSearch } from "react-icons/lu";
import usePDFStore from "../store/PDFStore";

export default function Resources() {
    const resources=usePDFStore(state=>state.resources)
    return(
        <div id="resources">
            <h1><LuTextSearch /> Resources</h1>
            <div className="resources-content">
                {resources?.map((resource, i) => {
                    // if(i%2==0){
                    //     return (
                    //         <div className="item" key={i}>
                    //             <div className="img vid">
                    //                 <FaRegCirclePlay />
                    //                 <img src="https://miro.medium.com/v2/resize:fit:1100/format:webp/1*3XS-8r8adjnRoNH4YjKXpw.png" alt="resource" />
                    //             </div>
                    //             <p>Lorem ipsum dolor sit amet conse ctetur adipisicing elit. Maxime mollitia, molestiae quas vel</p>
                    //         </div>
                    //     );
                    // } else {
                    //     return (
                    //         <div className="item" key={i}>
                    //             <div className="img">
                    //                 <FaRegCirclePlay />
                    //                 <img src="https://miro.medium.com/v2/resize:fit:1100/format:webp/1*3XS-8r8adjnRoNH4YjKXpw.png" alt="resource" />
                    //             </div>
                    //             <p>Lorem ipsum dolor sit amet conse ctetur adipisicing elit. Maxime mollitia, molestiae quas vel</p>
                    //         </div>
                    //     );
                    // }
            
                    return  <div className="item" key={i}>
                                <div className="img vid">
                                    <FaRegCirclePlay />
                                    <img src="https://miro.medium.com/v2/resize:fit:1100/format:webp/1*3XS-8r8adjnRoNH4YjKXpw.png" alt="resource" />
                                </div>
                                <p>Lorem ipsum dolor sit amet conse ctetur adipisicing elit. Maxime mollitia, molestiae quas vel</p>
                            </div>
                })}
            </div>
        </div>
    )
}