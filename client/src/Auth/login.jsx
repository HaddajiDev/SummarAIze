import "./style.scss"
import { NavLink } from "react-router-dom";
import { Modal,Input,Form,Button,Checkbox,Spin } from 'antd';
import useAuthStore from "../store/AuthStore";

// Icon
import { MdOutlineAlternateEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { LoadingOutlined } from '@ant-design/icons';

export default function Login({open,setOpen}) {
    const {loginLoading,handleLogin} = useAuthStore();
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        handleLogin({
            email:values.email,
            password:values.password,
            keepLogin:values.keepLogin
        });
    };

    return (
        <Modal
            title="Sign in"
            className="login"
            open={open=="login"}
            onCancel={()=>setOpen(null)}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                requiredMark='optional'
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please enter email!" },
                        { type: 'email', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter valid email!" }
                    ]}
                >
                    <Input size="large" placeholder="Enter your email" prefix={<MdOutlineAlternateEmail />} />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    className="password"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Please enter password!' },
                        { min: 6, message: 'Password must be at least 6 characters' }
                    ]}
                >
                    <Input.Password size="large" placeholder="Enter your password" prefix={<TbLockPassword />} />
                </Form.Item>
                <Form.Item
                    name="keepLogin"
                    className="check"
                    initialValue={false}
                    valuePropName="checked"
                >
                    <div>
                        <Checkbox>
                            Keep me logged in
                        </Checkbox>
                        <NavLink to={"/forgot-password"} onClick={()=>setOpen(null)} className="lnkP">Forgot Password ?</NavLink>
                    </div>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" block>
                        {loginLoading ?<Spin indicator={<LoadingOutlined spin />} /> :"Login"}
                    </Button>
                </Form.Item>
                <p className="lnk">
                    Don't have an account ? 
                    <a onClick={()=>setOpen("register")}>Sign up</a>
                </p>
            </Form>
        </Modal>
    )
}