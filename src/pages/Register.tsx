import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

export const Register: React.FC = () => {
    return (
        <Card style={{ maxWidth: 400, margin: '50px auto' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Register</Title>
            {/* TODO: Add registration form fields here */}
        </Card>
    );
};
