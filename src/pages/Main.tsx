import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

export const Main: React.FC = () => {
    return (
        <div>
            <Title level={1}>Welcome to the Main Page</Title>
            <Paragraph>This is the main public page. Anyone can see this.</Paragraph>
        </div>
    );
};
