import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SocialAuthButtons } from './SocialAuthButtons';
import FloatLabel from '../FloatLabel';
import { authService, type LoginDto } from '../../api/auth';
import { useAppDispatch } from '../../store/hooks';
import { login } from '../../store/slices/authSlice';

interface LoginFormProps {
    onRegisterClick: () => void;
    onForgotPasswordClick: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick, onForgotPasswordClick }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: LoginDto) => {
        setLoading(true);
        try {
            const response = await authService.login(values);
            localStorage.setItem('token', response.token);
            dispatch(login(response));
            message.success(t('auth.login.login_success'));
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Login error:', error);
            let errorMsg = t('auth.login.login_error');
            if (error.response?.data && typeof error.response.data === 'string') {
                errorMsg = error.response.data;
            }
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Form
                name="login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                layout="vertical"
                size="large"
            >
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: t('auth.login.email_required') }]}
                >
                    <FloatLabel label={t('auth.login.email_label')} name="email">
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} />
                    </FloatLabel>
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: t('auth.login.password_required') }]}
                >
                    <FloatLabel label={t('auth.login.password_label')} name="password">
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                        />
                    </FloatLabel>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        {t('auth.login.submit_btn')}
                    </Button>
                </Form.Item>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button type="link" onClick={onForgotPasswordClick} style={{ paddingLeft: 0 }}>
                        {t('auth.login.forgot_password_link')}
                    </Button>
                    <Button type="link" onClick={onRegisterClick} style={{ paddingRight: 0 }}>
                        {t('auth.login.register_link')}
                    </Button>
                </div>
            </Form>

            <SocialAuthButtons />
        </div>
    );
};
