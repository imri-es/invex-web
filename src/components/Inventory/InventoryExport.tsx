import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

export const InventoryExport: React.FC = () => {
    return (
        <div>
            <Title level={4}>Export Inventory</Title>
            <p>This tab will contain options to export the inventory data.</p>
        </div>
    );
};
