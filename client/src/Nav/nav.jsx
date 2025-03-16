import { Button } from "antd"
import "./style.scss"

export default function Nav() {
    return (
        <nav>
            <div className="l-s">
                <h1>smartPDF</h1>
            </div>
            <div className="r-s">
                <Button>Login</Button>
                <Button type="primary">Register</Button>
            </div>
        </nav>
    )
}