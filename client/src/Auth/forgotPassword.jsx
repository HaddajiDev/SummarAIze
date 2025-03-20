import "./style.scss";
import { useState } from "react";
import { useForm } from "antd/es/form/Form";
import { Button, Form, Input, message, Spin } from "antd";


import { MdOutlineEmail } from "react-icons/md";
import { LoadingOutlined } from "@ant-design/icons";
import { TbLockPassword } from "react-icons/tb";
import { useNavigate } from "react-router-dom";


export default function ForgotPassword() {
    const [form] = useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [otpStatus, setOtpStatus] = useState("1step");
    const [data,setData] = useState({});

    const handleForgotPassword = async(values) => {
        // First setp actions
        if(otpStatus==="1step"&&values.email&&!loading){
            // console.log(values);
            setData(values);
            setOtpStatus("2step");
        }
        // Second step actions
        if(otpStatus==="2step"&&values.otp&&!loading){
            // console.log(values);
            setData({...data,otp:values.otp});
            setOtpStatus("3step");
        }
        // Third step actions
        if(otpStatus==="3step"&&values.password&&!loading){
            if(values.password!=values.confirm){
                form.setFields([
                    {
                        name: "confirm",
                        errors: ["Passwords do not match"]
                    }
                ]);
                return;
            }
            // Check if email and otp code is entered (optional but recommended)
            if(!data.email&&!data.otp){
                message.error("Please enter your email and OTP code first.");
                setOtpStatus("1step");
                setLoading(false);
                return;
            }
            // console.log(values);
            setData({...data,password:values.password});
            setData({});
        }
    }

    return (
        <div className="forgot-password">
            <h3>Forgot password</h3>
            {(otpStatus==="1step"||otpStatus==="2step") && (
                <p>Enter your email to receive a verification code and reset your password.</p>
            )}
            {otpStatus==="3step" && (
                <p>Change password and enjoy to study</p>
            )}
            <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                onFinish={handleForgotPassword}
            >
                {(otpStatus==="1step"||otpStatus==="2step") && (
                    <Form.Item
                        label="Email Address"
                        name="email"
                        rules={[
                            { required: true, message: "Email is required" },
                            { 
                                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Email format is not valid"
                            },
                        ]}
                    >
                        <Input disabled={otpStatus!="1step"} size="large" placeholder="Email Address" prefix={<MdOutlineEmail />} />
                    </Form.Item>
                )}

                {otpStatus==="2step" && (
                    <Form.Item
                        className="otp"
                        label="Enter OTP Code"
                        name="otp"
                        style={{textAlign: "center", marginTop: "25px"}}
                        rules={[
                            { required: true},
                            { 
                                pattern: /^[a-zA-Z0-9]{6}$/,
                                message: "OTP format is not valid"
                            },
                        ]}
                    >
                        <Input.OTP />
                    </Form.Item>
                )}

                {otpStatus==="3step" && (
                    <>
                        <Form.Item
                            name="password"
                            label="New Password"
                            rules={[
                                {required: true, message: 'Password is required'},
                                { min: 6, message: "Password must be at least 6 characters" },
                            ]}
                            hasFeedback
                        >
                            <Input.Password size="large" placeholder="Enter password" prefix={<TbLockPassword />} />
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
                    </>
                )}

                <Form.Item>
                    {otpStatus==="1step" && (
                        <Button htmlType="submit" block type="primary" size="large" style={{width: "100%", margin: "0 auto"}}>
                            {loading ?<Spin indicator={<LoadingOutlined spin />} /> :"Send code"}
                        </Button>
                    )}
                    {otpStatus==="2step" && (
                        <Button htmlType="submit" block type="primary" size="large" style={{width: "200px", margin: "5px auto 0 auto", display: "block"}}>
                            {loading ?<Spin indicator={<LoadingOutlined spin />} /> :"Verify OTP"}
                        </Button>
                    )}
                    {otpStatus==="3step" && (
                        <Button htmlType="submit" block type="primary" size="large" style={{width: "200px", margin: "5px auto 0 auto", display: "block"}}>
                            {loading ?<Spin indicator={<LoadingOutlined spin />} /> :"Save"}
                        </Button>
                    )}
                </Form.Item>
            </Form>
        </div>
    )
}