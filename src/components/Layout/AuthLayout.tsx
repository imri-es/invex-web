import React from 'react';
import { Layout } from 'antd';
import { useMobile } from '../../hooks/useMobile';

const { Content } = Layout;

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isMobile = useMobile();
    return (
        <Layout style={{ height: '100vh' }}> {/*overflow: 'hidden'*/}
            <Content
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#f0f2f5',
                    margin: isMobile ? '8px' : '32px',
                }}
            >
                {children}
            </Content>
        </Layout>
    );
};
