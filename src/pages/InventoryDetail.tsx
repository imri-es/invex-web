import React from 'react';
import { Typography, Tabs, Badge } from 'antd';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import type { TabsProps } from 'antd';

import { InventoryItems } from '../components/Inventory/InventoryItems';
import { InventoryReviews } from '../components/Inventory/InventoryReviews';
import { InventorySettings } from '../components/Inventory/InventorySettings';
import { InventoryExport } from '../components/Inventory/InventoryExport';
import { InventoryCustomID } from '../components/Inventory/InventoryCustomID';
import { InventoryAccess } from '../components/Inventory/InventoryAccess';
import { InventoryFields } from '../components/Inventory/InventoryFields';
import { InventoryDashboard } from '../components/Inventory/InventoryDashboard';
import api from '../api/axios';
import { useStore } from 'react-redux';

const { Title } = Typography;

export const InventoryDetailContext = React.createContext<{
    triggerAutoSave: () => void;
}>({ triggerAutoSave: () => { } });

export const InventoryDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const inventory = useAppSelector((state) =>
        state.inventory.items.find(inv => inv.id === id)
    );
    const store = useStore();
    const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const [saveStatus, setSaveStatus] = React.useState<'idle' | 'pending' | 'error'>('idle');

    const triggerAutoSave = React.useCallback(() => {
        if (!id) return;

        setSaveStatus('pending');

        // If a timer is NOT running, start a 7-second timer
        if (!saveTimerRef.current) {
            saveTimerRef.current = setTimeout(async () => {
                const state = store.getState() as any; // Type access
                const latestInventory = state.inventory.items.find((inv: any) => inv.id === id);

                if (latestInventory) {
                    try {
                        const payload = {
                            name: latestInventory.name,
                            visibility: latestInventory.visibility,
                            customIdMask: latestInventory.customIdMask,
                            fields: latestInventory.fields,
                            accesses: latestInventory.accesses
                        };
                        await api.put(`/inventories/${id}`, payload);
                        setSaveStatus('idle');
                    } catch (error) {
                        console.error('Failed to auto-save inventory:', error);
                        setSaveStatus('error');
                    }
                }

                saveTimerRef.current = null;
            }, 7000);
        }
    }, [id, store]);

    // Cleanup timer on unmount
    React.useEffect(() => {
        return () => {
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
        };
    }, []);

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
        {
            key: 'custom-id',
            label: 'Custom ID',
            children: <InventoryCustomID />,
        },
        {
            key: 'access',
            label: 'Access',
            children: <InventoryAccess />,
        },
        {
            key: 'fields',
            label: 'Fields',
            children: <InventoryFields />
        },
        {
            key: 'dashboard',
            label: 'Dashboard',
            children: <InventoryDashboard />
        }

    ];

    return (
        <div style={{ padding: '0px 10px' }}>
            <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Title level={2} style={{ margin: 0 }}>{inventory.name}</Title>
                    {saveStatus === 'pending' && <Badge status="warning" text={<span style={{ color: '#faad14' }}>Changes pending</span>} />}
                    {saveStatus === 'idle' && <Badge status="success" text={<span style={{ color: '#52c41a' }}>Changes are saved</span>} />}
                    {saveStatus === 'error' && <Badge status="error" text={<span style={{ color: '#ff4d4f' }}>Changes are not saved</span>} />}
                </div>
                <div style={{ color: 'rgba(0, 0, 0, 0.45)', marginTop: 8 }}>
                    Inventory ID: {inventory.id}
                </div>
            </div>

            <InventoryDetailContext.Provider value={{ triggerAutoSave }}>
                <Tabs defaultActiveKey="items" items={items} />
            </InventoryDetailContext.Provider>
        </div>
    );
};
