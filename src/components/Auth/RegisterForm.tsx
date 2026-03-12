import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import FloatLabel from '../FloatLabel';
import { SocialAuthButtons } from './SocialAuthButtons';
import { authService, type RegisterDto } from '../../api/auth';
import { useAppDispatch } from '../../store/hooks';
import { login } from '../../store/slices/authSlice';

interface RegisterFormProps {
    onBackToLoginClick: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onBackToLoginClick }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: RegisterDto) => {
        setLoading(true);
        try {
            const response = await authService.register(values);
            // Save token and dispatch login to Redux
            localStorage.setItem('token', response.token);
            localStorage.setItem('userEmail', response.email);
            localStorage.setItem('userName', response.fullName);
            dispatch(login(response));
            message.success(t('auth.register.register_success'));
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Registration error:', error);
            let errorMsg = t('auth.register.register_error');
            if (error.response?.data) {
                if (Array.isArray(error.response.data)) {
                    errorMsg = error.response.data.map((e: any) => e.description).join('\n');
                } else if (typeof error.response.data === 'string') {
                    errorMsg = error.response.data;
                } else if (error.response.data.title) {
                    errorMsg = error.response.data.title;
                }
            }
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Form
                name="register"
                onFinish={onFinish}
                layout="vertical"
                size="large"
            >
                <Form.Item
                    name="fullName"
                    rules={[{ required: true, message: t('auth.register.fullname_required') }]}
                >
                    <FloatLabel label={t('auth.register.fullname_label')} name="fullName">
                        <Input prefix={<UserOutlined />} />
                    </FloatLabel>
                </Form.Item>

                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: t('auth.register.email_required') },
                        { type: 'email', message: t('auth.register.email_invalid') }
                    ]}
                >
                    <FloatLabel label={t('auth.register.email_label')} name="email">
                        <Input prefix={<MailOutlined />} />
                    </FloatLabel>
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: t('auth.register.password_required') },
                        () => ({
                            validator(_, value) {
                                if (!value) {
                                    return Promise.resolve();
                                }
                                if (value.length < 6) {
                                    return Promise.reject(new Error(t('auth.register.password_min_length')));
                                }
                                if (!/[A-Z]/.test(value)) {
                                    return Promise.reject(new Error(t('auth.register.password_uppercase')));
                                }
                                if (!/[a-z]/.test(value)) {
                                    return Promise.reject(new Error(t('auth.register.password_lowercase')));
                                }
                                if (!/[0-9]/.test(value)) {
                                    return Promise.reject(new Error(t('auth.register.password_number')));
                                }
                                if (!/[^A-Za-z0-9]/.test(value)) {
                                    return Promise.reject(new Error(t('auth.register.password_special')));
                                }
                                return Promise.resolve();
                            },
                        })
                    ]}
                >
                    <FloatLabel label={t('auth.register.password_label')} name="password">
                        <Input.Password
                            prefix={<LockOutlined />}
                        />
                    </FloatLabel>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        {t('auth.register.submit_btn')}
                    </Button>
                </Form.Item>

                <SocialAuthButtons />

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Button type="link" onClick={onBackToLoginClick}>
                        {t('auth.register.back_to_login_link')}
                    </Button>
                </div>
            </Form>
        </div>
    );
};
