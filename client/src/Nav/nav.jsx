import { Button, Dropdown } from "antd"
import "./style.scss"
import Login from "../Auth/login"
import { useState } from "react";
import Register from "../Auth/register";
import useAuthStore from "../store/AuthStore";
import { NavLink, useNavigate } from "react-router-dom";

export default function Nav() {
    const user = useAuthStore(state=>state.user);
    const handleLogout = useAuthStore(state=>state.handleLogout);
    const navigate = useNavigate();
    return (
        <nav id="nav2">
            <div className="l-s">
                <NavLink to={"/"}>Summar<span>AI</span>ze</NavLink>
            </div>
            <div className="r-s">
                <Dropdown 
                    menu={{ items: [
                        { key: '1', label: 'Upgrade To Premium Plan', onClick:()=>{} },
                    ] 
                    }} 
                    placement="bottomRight"
                    arrow
                >
                    <p className="plan">Free plan</p>
                </Dropdown>
                <div className="pfp">
                    <Dropdown 
                        menu={{ items: [
                            { key: '1', label: 'Settings', onClick:()=>{} },
                            { key: '2', label: 'Logout', onClick:async()=>{
                                await handleLogout();
                                navigate('/');
                                window.location.reload();
                            } }
                        ] 
                        }} 
                        placement="bottomRight"
                        arrow
                    >
                        <img src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.username}&backgroundColor=7065ef`} />
                    </Dropdown>
                </div>
            </div>
        </nav>
    )
}