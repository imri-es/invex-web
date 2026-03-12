import React from 'react';
import { Typography, Table, Button, Space, Popconfirm, Modal, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addInventory, deleteInventory, type Inventory } from '../store/slices/inventorySlice';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const { Title } = Typography;

export const Inventories: React.FC = () => {
    const inventories = useAppSelector((state) => state.inventory.items);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false);
    const [newInventoryName, setNewInventoryName] = React.useState('');
    const [isCreating, setIsCreating] = React.useState(false);

    const handleDelete = (id: string) => {
        dispatch(deleteInventory(id));
    };

    const handleCreateInventory = async () => {
        if (!newInventoryName.trim()) return;
        setIsCreating(true);
        try {
            const response = await api.post('/inventories', {
                name: newInventoryName.trim(),
                visibility: 'Private'
            });

            // Map the backend DTO to frontend Inventory shape
            const newInventory: Inventory = {
                id: response.data.id,
                name: response.data.name,
                recordsCount: response.data.numberOfRecords,
                lastModified: response.data.updatedAt,
                modifiedBy: response.data.ownerEmail,
                owner: response.data.ownerEmail,
                access: 'Admin'
            };

            dispatch(addInventory(newInventory));
            setIsCreateModalVisible(false);
            setNewInventoryName('');
        } catch (error) {
            console.error("Failed to create inventory", error);
            // Ideally add an antd message toast here too
        } finally {
            setIsCreating(false);
        }
    };

    const columns: ColumnsType<Inventory> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <a onClick={() => navigate(`/inventories/${record.id}`)}>{text}</a>,
        },
        {
            title: 'Number of records',
            dataIndex: 'recordsCount',
            key: 'recordsCount',
        },
        {
            title: 'Last Modified',
            dataIndex: 'lastModified',
            key: 'lastModified',
            render: (dateStr: string) => new Date(dateStr).toLocaleString(),
        },
        {
            title: 'Owner',
            dataIndex: 'owner',
            key: 'owner',
        },
        {
            title: 'Access',
            dataIndex: 'access',
            key: 'access',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        style={{ color: '#1677ff', borderColor: '#1677ff', backgroundColor: 'transparent' }}
                        onClick={() => navigate(`/inventories/${record.id}`)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete inventory"
                        description="Are you sure you want to delete this inventory?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                            style={{ backgroundColor: '#fff1f0', borderColor: '#ffa39e' }}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        }
    ];

    return (
        <div style={{ padding: '0px 10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>Inventories</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => setIsCreateModalVisible(true)}
                >
                    Create New Inventory
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={inventories}
                rowKey="id"
                pagination={false}
                style={{ width: '100%' }}
            />

            <Modal
                title="Create New Inventory"
                open={isCreateModalVisible}
                onOk={handleCreateInventory}
                onCancel={() => {
                    setIsCreateModalVisible(false);
                    setNewInventoryName('');
                }}
                confirmLoading={isCreating}
                okText="Create"
            >
                <div style={{ marginBottom: 16 }}>
                    <Typography.Text strong>Table Name</Typography.Text>
                </div>
                <Input
                    placeholder="Enter inventory name..."
                    value={newInventoryName}
                    onChange={(e) => setNewInventoryName(e.target.value)}
                    onPressEnter={handleCreateInventory}
                    autoFocus
                />
            </Modal>
        </div>
    );
};