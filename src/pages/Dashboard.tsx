import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

export const Dashboard: React.FC = () => {
    return (
        <div>
            <Title level={1}>Dashboard</Title>
            <Paragraph>This is the protected dashboard page. Only authenticated users can see this.</Paragraph>
        </div>
    );
};
