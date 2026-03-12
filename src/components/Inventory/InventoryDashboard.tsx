import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

export const InventoryDashboard: React.FC = () => {
    return (
        <div>
            <Title level={4}>Inventory Dashboard</Title>
            <p>This tab will contain configuration and Dashboard for the inventory.</p>
        </div>
    );
};
