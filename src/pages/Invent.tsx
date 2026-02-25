import React from 'react';
import { Typography, Table, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { deleteInventory, type Inventory } from '../store/slices/inventorySlice';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

export const Inventories: React.FC = () => {
    const inventories = useAppSelector((state) => state.inventory.items);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleDelete = (id: string) => {
        dispatch(deleteInventory(id));
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
            title: 'Modified by Who',
            dataIndex: 'modifiedBy',
            key: 'modifiedBy',
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
                <Button type="primary" icon={<PlusOutlined />} size="large">
                    Create New Inventory
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={inventories}
                rowKey="id"
                pagination={false}
            />
        </div>
    );
};