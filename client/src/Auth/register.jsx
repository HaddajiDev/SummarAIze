import "./style.scss"
import { Modal,Input,Form,Button,Spin } from 'antd';

// Icon
import { MdOutlineAlternateEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { LoadingOutlined } from '@ant-design/icons';
import { LuUserCheck } from "react-icons/lu";
import useAuthStore from "../store/AuthStore";

export default function Register({open,setOpen}) {
    const {handleSignUp, signupLoading} = useAuthStore();
    const [form] = Form.useForm();

    const handleFinish = async(values) => {
        await handleSignUp({
            email:values.email,
            password:values.password,
            username:values.username
        });
        
    };

    return (
        <Modal
            title="Sign up"
            className="signup"
            open={open=="register"}
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
                    label="Username"
                    name="username"
                    rules={[
                        { required: true, message: "Username is required" },
                    ]}
                >
                    <Input size="large" placeholder="Enter your username" prefix={<LuUserCheck />} />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Email is required" },
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
                        { required: true, message: 'Password is required' },
                        { min: 6, message: 'Password must be at least 6 characters' }
                    ]}
                >
                    <Input.Password size="large" placeholder="Enter your password" prefix={<TbLockPassword />} />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {required: true, message: 'Confirm password is required'},
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Passwords do not match'));
                            },
                        }),
                    ]}
                >
                    <Input.Password size="large" placeholder="Enter confirm password" prefix={<TbLockPassword />} />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" block>
                        {signupLoading ?<Spin indicator={<LoadingOutlined spin />} /> :"Register"}
                    </Button>
                </Form.Item>
                <p className="lnk">
                    Did you have an account ? 
                    <a onClick={()=>setOpen("login")}>Sign in</a>
                </p>
            </Form>
        </Modal>
    )
}