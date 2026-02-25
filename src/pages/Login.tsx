import React, { useState } from 'react';
import { Card, Flex, Typography } from 'antd';
import { useMobile } from '../hooks/useMobile';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '../components/Auth/LoginForm';
import { RegisterForm } from '../components/Auth/RegisterForm';
import { ForgotPasswordForm } from '../components/Auth/ForgotPasswordForm';
import inventoryImage from '../assets/inventory.png';
import logo from '../assets/logo.svg';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title } = Typography;

type AuthView = 'login' | 'register' | 'forgot_password';

export const Login: React.FC = () => {
    const isMobile = useMobile();
    const { t } = useTranslation();
    const [currentView, setCurrentView] = useState<AuthView>('login');

    const renderView = () => {
        switch (currentView) {
            case 'register':
                return <RegisterForm onBackToLoginClick={() => setCurrentView('login')} />;
            case 'forgot_password':
                return <ForgotPasswordForm onBackToLoginClick={() => setCurrentView('login')} />;
            case 'login':
            default:
                return (
                    <LoginForm
                        onRegisterClick={() => setCurrentView('register')}
                        onForgotPasswordClick={() => setCurrentView('forgot_password')}
                    />
                );
        }
    };

    const getViewTitle = () => {
        switch (currentView) {
            case 'register': return t('auth.register.title');
            case 'forgot_password': return t('auth.forgot_password.title');
            case 'login':
            default: return t('auth.login.title');
        }
    };

    return (
        <Card
            styles={{ body: { height: "100%" } }}
            style={{
                width: "100%",
                height: "100%",
                borderRadius: 16,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
        >
            <Flex gap="small" style={{ width: "100%", height: "100%", position: "relative" }}>
                <img src={logo} style={{ position: "absolute", top: "20px", left: "20px", height: "30px", zIndex: 1 }} />
                <Card styles={{ body: { width: "75%" } }} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: isMobile ? "100%" : "50%", height: "100%", border: "none" }}>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: 0 }}>
                        {getViewTitle()}
                    </Title>
                    <Typography style={{ textAlign: 'center', margin: "0 0 24px 0", opacity: 0.5 }}>
                        {t('auth.banner.login_instruction')}
                    </Typography>
                    {renderView()}
                    <div style={{ position: "absolute", top: "0px", right: "0", transform: "translateX(-50%)", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "24px" }}>
                        <Link to="/dashboard" style={{ fontWeight: 'bold' }}>
                            {t('auth.login.loginAsGuest')} <ArrowRightOutlined />
                        </Link>
                    </div>
                </Card>
                <Card style={{
                    display: isMobile ? "none" : "flex",
                    width: "50%",
                    height: "100%",
                    borderRadius: 32,
                    backgroundColor: "#0757cfff",
                    position: "relative",
                    overflow: "hidden",
                    alignItems: "flex-start",
                }}>
                    <Title level={2} style={{ color: "#fff", zIndex: 1, marginTop: "60px" }}>{t('auth.banner.title')}</Title>
                    <Typography.Text style={{ color: "#fff", zIndex: 1 }}>{t('auth.banner.subtitle')}</Typography.Text>
                    <img
                        style={{
                            position: "absolute",
                            top: "35%",
                            left: "20%",
                            height: "70%",
                            borderBottomRightRadius: 32
                        }}
                        src={inventoryImage}
                        alt="Inventory"
                    />
                </Card>

            </Flex >

        </Card >
    );
};
