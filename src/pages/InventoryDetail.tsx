import React from 'react';
import { Typography, Tabs } from 'antd';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import type { TabsProps } from 'antd';

import { InventoryItems } from '../components/Inventory/InventoryItems';
import { InventoryReviews } from '../components/Inventory/InventoryReviews';
import { InventorySettings } from '../components/Inventory/InventorySettings';
import { InventoryExport } from '../components/Inventory/InventoryExport';

const { Title } = Typography;

export const InventoryDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const inventory = useAppSelector((state) =>
        state.inventory.items.find(inv => inv.id === id)
    );

    if (!inventory) {
        return <div style={{ padding: '24px' }}><Title level={3}>Inventory not found</Title></div>;
    }

    const items: TabsProps['items'] = [
        {
            key: 'items',
            label: 'Items',
            children: <InventoryItems />,
        },
        {
            key: 'reviews',
            label: 'Reviews',
            children: <InventoryReviews />,
        },
        {
            key: 'settings',
            label: 'Settings',
            children: <InventorySettings />,
        },
        {
            key: 'export',
            label: 'Export',
            children: <InventoryExport />,
        },
    ];

    return (
        <div style={{ padding: '0px 10px' }}>
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>{inventory.name}</Title>
                <div style={{ color: 'rgba(0, 0, 0, 0.45)', marginTop: 8 }}>
                    Inventory ID: {inventory.id}
                </div>
            </div>

            <Tabs defaultActiveKey="items" items={items} />
        </div>
    );
};
