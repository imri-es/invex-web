import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

export const InventorySettings: React.FC = () => {
    return (
        <div>
            <Title level={4}>Inventory Settings</Title>
            <p>This tab will contain configuration and settings for the inventory.</p>
        </div>
    );
};
