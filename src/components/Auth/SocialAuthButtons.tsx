import React, { useState } from 'react';
import { Button, Divider, Space, Typography, message } from 'antd';
import { GoogleOutlined, FacebookOutlined, AppleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useGoogleLogin } from '@react-oauth/google';
import { authService } from '../../api/auth';
import { useAppDispatch } from '../../store/hooks';
import { login } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

export const SocialAuthButtons: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [loadingProvider, setLoadingProvider] = useState<'google' | 'facebook' | 'apple' | null>(null);

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoadingProvider('google');
            try {
                const response = await authService.authSocial({
                    provider: 'google',
                    token: tokenResponse.access_token,
                });
                localStorage.setItem('token', response.token);
                localStorage.setItem('userEmail', response.email);
                localStorage.setItem('userName', response.fullName);
                dispatch(login(response));
                message.success(t('auth.login.login_success'));
                navigate('/dashboard');
            } catch (error: any) {
                console.error('Google login error:', error);
                message.error(error.response?.data || t('auth.login.login_error'));
            } finally {
                setLoadingProvider(null);
            }
        },
        onError: () => {
            message.error('Google Login Failed');
        }
    });

    return (
        <>
            <Divider plain>
                <Text type="secondary">{t('auth.login.or_divider')}</Text>
            </Divider>

            <Space direction="horizontal" size="large" style={{ width: '100%', justifyContent: 'center' }}>
                <Button
                    shape="circle"
                    icon={<GoogleOutlined />}
                    size="large"
                    onClick={() => googleLogin()}
                    loading={loadingProvider === 'google'}
                />
                <Button shape="circle" icon={<FacebookOutlined />} size="large" />
                <Button shape="circle" icon={<AppleOutlined />} size="large" />
            </Space>
        </>
    );
};
