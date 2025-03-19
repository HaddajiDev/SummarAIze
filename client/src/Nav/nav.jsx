import { Button } from "antd"
import "./style.scss"
import Login from "../Auth/login"
import { useState } from "react";
import Register from "../Auth/register";

export default function Nav() {
    const [open, setOpen] = useState(null);
    return (
        <nav id="nav">
            <div className="l-s">
                <h1>smartPDF</h1>
            </div>
            <div className="r-s">
                <Button onClick={()=>setOpen("login")}>Login</Button>
                <Button onClick={()=>setOpen("register")} type="primary">Register</Button>
                <Login open={open} setOpen={setOpen} />
                <Register open={open} setOpen={setOpen} />
            </div>
        </nav>
    )
}