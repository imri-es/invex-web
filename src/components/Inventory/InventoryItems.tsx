import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

export const InventoryItems: React.FC = () => {
    return (
        <div>
            <Title level={4}>Inventory Items</Title>
            <p>This tab will contain the list of items in the inventory.</p>
        </div>
    );
};
