import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import hyperviseLogo from '../assets/hypervise.png';
import chargezoneLogo from '../assets/chargezone.png';

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e2d5b] via-indigo-900 to-[#0f172a] p-4 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000"></div>

      <div className="relative w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Branding / Info */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 bg-white/5">
          <div>
            <div className="flex items-center gap-4 mb-8">
               <img src={hyperviseLogo} alt="Hypervise Logo" className="h-8 object-contain filter brightness-0 invert" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-4">
              Smart Station Intelligence
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed max-w-sm">
              Securely monitor, manage, and analyze your EV charging infrastructure with cutting-edge AI detections and real-time alerts.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 mt-12">
             <span className="text-xs text-white/50 uppercase tracking-widest font-semibold">Powered by</span>
             <img src={chargezoneLogo} alt="ChargeZone Logo" className="h-6 object-contain filter brightness-0 invert" />
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-10 bg-white shadow-inner">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-sm text-gray-500 mt-1">Please enter your credentials to continue</p>
          </div>

          <Form
            name="normal_login"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
            className="w-full"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your Username!' }]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />} 
                placeholder="Admin Username" 
                className="rounded-lg border-gray-300 hover:border-[#1e2d5b] focus:border-[#1e2d5b] py-2"
              />
            </Form.Item>
            
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
                className="rounded-lg border-gray-300 hover:border-[#1e2d5b] focus:border-[#1e2d5b] py-2"
              />
            </Form.Item>
            
            <div className="flex items-center justify-between mb-6">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-sm text-gray-600">Remember me</Checkbox>
              </Form.Item>

              <a className="text-sm font-medium text-[#1e2d5b] hover:text-blue-800 transition-colors" href="#">
                Forgot password?
              </a>
            </div>

            <Form.Item className="mb-0">
              <Button 
                type="primary" 
                htmlType="submit" 
                className="w-full h-12 bg-[#1e2d5b] hover:bg-blue-900 border-none rounded-lg text-white font-semibold text-base shadow-lg shadow-blue-900/30 transition-all"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
