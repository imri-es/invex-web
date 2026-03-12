import React, { useContext, useEffect, useState } from 'react';
import { Typography, Table, Button, Space, Input, Select, Checkbox, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { patchInventoryLocal, type CustomField } from '../../store/slices/inventorySlice';
import { InventoryDetailContext } from '../../pages/InventoryDetail';
import api from '../../api/axios';

const { Title } = Typography;

export const InventoryFields: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { triggerAutoSave } = useContext(InventoryDetailContext);

    const inventory = useAppSelector((state) =>
        state.inventory.items.find(inv => inv.id === id)
    );
    const fields = inventory?.fields;
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch fields if they haven't been loaded into redux yet
        if (id && !fields) {
            setIsLoading(true);
            api.get(`/inventories/${id}/fields`)
                .then(res => {
                    dispatch(patchInventoryLocal({ id, fields: res.data }));
                })
                .catch(err => {
                    console.error("Failed to load fields", err);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [id, fields, dispatch]);

    const handleUpdate = (newFields: CustomField[]) => {
        if (!id) return;
        dispatch(patchInventoryLocal({ id, fields: newFields }));
        triggerAutoSave();
    };

    const addField = () => {
        const currentFields = fields || [];
        const newField: CustomField = {
            id: undefined, // undefined indicates it's new for backend
            name: 'New Field',
            type: 'SingleLine',
            isDisplay: false
        };
        handleUpdate([...currentFields, newField]);
    };

    const removeField = (index: number) => {
        const currentFields = fields ? [...fields] : [];
        currentFields.splice(index, 1);
        handleUpdate(currentFields);
    };

    const updateField = (index: number, key: keyof CustomField, value: any) => {
        const currentFields = fields ? [...fields] : [];
        currentFields[index] = { ...currentFields[index], [key]: value };
        handleUpdate(currentFields);
    };

    const columns = [
        {
            title: 'Field Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: CustomField, index: number) => (
                <Input
                    value={text}
                    onChange={e => updateField(index, 'name', e.target.value)}
                    placeholder="E.g., Serial Number"
                />
            )
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            width: 200,
            render: (text: string, record: CustomField, index: number) => (
                <Select
                    value={text}
                    style={{ width: '100%' }}
                    onChange={val => updateField(index, 'type', val)}
                    options={[
                        { value: 'SingleLine', label: 'Single Line Text' },
                        { value: 'MultiLine', label: 'Multi Line Text' },
                        { value: 'Numeric', label: 'Numeric' },
                        { value: 'Boolean', label: 'Boolean (Yes/No)' },
                        { value: 'Document', label: 'Document/Image' },
                    ]}
                />
            )
        },
        {
            title: 'Show in List',
            dataIndex: 'isDisplay',
            key: 'isDisplay',
            width: 120,
            align: 'center' as const,
            render: (checked: boolean, record: CustomField, index: number) => (
                <Checkbox
                    checked={checked}
                    onChange={e => updateField(index, 'isDisplay', e.target.checked)}
                />
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            align: 'center' as const,
            render: (_: any, record: CustomField, index: number) => (
                <Popconfirm
                    title="Delete field"
                    description="Are you sure you want to remove this field?"
                    onConfirm={() => removeField(index)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button danger icon={<DeleteOutlined />} type="text" />
                </Popconfirm>
            )
        }
    ];

    return (
        <div style={{ maxWidth: 800 }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4} style={{ margin: 0 }}>Custom Fields</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={addField}>
                    Add Field
                </Button>
            </div>
            <Table
                dataSource={fields || []}
                columns={columns}
                rowKey={(record, index) => record.id || `new-${index}`}
                pagination={false}
                loading={isLoading}
            />
        </div>
    );
};
