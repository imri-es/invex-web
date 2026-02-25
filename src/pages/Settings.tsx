import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

export const Settings: React.FC = () => {
    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Settings</Title>
            {/* Settings content will go here */}
        </div>
    );
};
