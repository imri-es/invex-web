import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

export const InventoryReviews: React.FC = () => {
    return (
        <div>
            <Title level={4}>Inventory Reviews</Title>
            <p>This tab will contain reviews and audit logs for the inventory.</p>
        </div>
    );
};
