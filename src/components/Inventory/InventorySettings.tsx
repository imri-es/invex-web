import React, { useContext } from 'react';
import { Typography, Input, Select, Form } from 'antd';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { patchInventoryLocal } from '../../store/slices/inventorySlice';
import { InventoryDetailContext } from '../../pages/InventoryDetail';

const { Title } = Typography;

export const InventorySettings: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { triggerAutoSave } = useContext(InventoryDetailContext);

    const inventory = useAppSelector((state) =>
        state.inventory.items.find(inv => inv.id === id)
    );

    const updateSetting = (key: string, value: any) => {
        if (!id) return;
        dispatch(patchInventoryLocal({ id, [key]: value }));
        triggerAutoSave();
    };

    if (!inventory) return null;

    return (
        <div style={{ maxWidth: 600 }}>
            <Title level={4} style={{ marginBottom: 24 }}>Inventory Settings</Title>

            <Form layout="vertical">
                <Form.Item label="Inventory Name">
                    <Input
                        value={inventory.name}
                        onChange={(e) => updateSetting('name', e.target.value)}
                        placeholder="Enter inventory name"
                    />
                </Form.Item>
                <Form.Item label="Visibility">
                    <Select
                        value={inventory.visibility || "Private"}
                        onChange={(val) => updateSetting('visibility', val)}
                        options={[
                            { value: 'Private', label: 'Private (Owner and allowed users only)' },
                            { value: 'Public', label: 'Public (Anyone can view)' },
                        ]}
                    />
                </Form.Item>
            </Form>
        </div>
    );
};
