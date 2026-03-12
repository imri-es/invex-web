import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Typography, Table, Button, Modal, Input, List, Avatar, Space, message, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import api from '../../api/axios';

const { Title, Text } = Typography;

interface AccessEntry {
    id: string;
    userId: string;
    email: string;
    fullName: string;
    accessType: string;
}

interface UserSearchResult {
    id: string;
    email: string;
    fullName: string;
}

export const InventoryAccess: React.FC = () => {
    const { id: inventoryId } = useParams<{ id: string }>();
    const inventory = useAppSelector((state) =>
        state.inventory.items.find(inv => inv.id === inventoryId)
    );
    const currentUser = useAppSelector((state) => state.auth.user);

    const [accesses, setAccesses] = useState<AccessEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
    const [searching, setSearching] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isOwnerOrAdmin = currentUser?.email === inventory?.owner;
    // Fetch accesses on mount and when inventory changes
    useEffect(() => {
        if (!inventoryId) return;
        fetchAccesses();
    }, [inventoryId]);

    const fetchAccesses = async () => {
        if (!inventoryId) return;
        setLoading(true);
        try {
            const res = await api.get(`/inventories/${inventoryId}/accesses`);
            setAccesses(res.data);
        } catch {
            message.error('Failed to load access list');
        } finally {
            setLoading(false);
        }
    };

    // Debounced search — fires 2s after user stops typing
    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value);
        setSearchResults([]);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (value.length < 2) {
            setSearching(false);
            return;
        }

        // Show loading state immediately while typing
        setSearching(true);

        debounceRef.current = setTimeout(async () => {
            try {
                const res = await api.get(`/users/search?q=${encodeURIComponent(value)}`);
                // Filter out users who already have access
                const existingUserIds = new Set(accesses.map(a => a.userId));
                setSearchResults(res.data.filter((u: UserSearchResult) => !existingUserIds.has(u.id)));
            } catch {
                message.error('Search failed');
            } finally {
                setSearching(false);
            }
        }, 1000);
    }, [accesses]);

    const handleGrantAccess = async (user: UserSearchResult) => {
        if (!inventoryId) return;
        try {
            const res = await api.post(`/inventories/${inventoryId}/accesses`, {
                userId: user.id,
                accessType: 'Write'
            });
            setAccesses(prev => [...prev, res.data]);
            setModalOpen(false);
            setSearchQuery('');
            setSearchResults([]);
            message.success(`Access granted to ${user.fullName || user.email}`);
        } catch (err: any) {
            const msg = err.response?.data || 'Failed to grant access';
            message.error(typeof msg === 'string' ? msg : 'Failed to grant access');
        }
    };

    const handleBulkDelete = async () => {
        if (!inventoryId || selectedRowKeys.length === 0) return;
        try {
            await api.delete(`/inventories/${inventoryId}/accesses`, {
                data: selectedRowKeys
            });
            setAccesses(prev => prev.filter(a => !selectedRowKeys.includes(a.id)));
            setSelectedRowKeys([]);
            message.success('Access revoked successfully');
        } catch {
            message.error('Failed to revoke access');
        }
    };

    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Name',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Access',
            dataIndex: 'accessType',
            key: 'accessType',
            render: (type: string) => (
                <Tag color={type === 'Admin' ? 'red' : type === 'Write' ? 'blue' : 'default'}>
                    {type}
                </Tag>
            ),
        },
    ];

    const rowSelection = isOwnerOrAdmin
        ? {
            selectedRowKeys,
            onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
        }
        : undefined;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>Access Management</Title>
                {isOwnerOrAdmin && (
                    <Space>
                        {selectedRowKeys.length > 0 && (
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={handleBulkDelete}
                            >
                                Remove {selectedRowKeys.length} user{selectedRowKeys.length > 1 ? 's' : ''}
                            </Button>
                        )}
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setModalOpen(true)}
                        >
                            Add User
                        </Button>
                    </Space>
                )}
            </div>

            {!isOwnerOrAdmin && (
                <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                    Only the owner or an admin can manage access.
                </Text>
            )}

            <Table
                rowKey="id"
                columns={columns}
                dataSource={accesses}
                loading={loading}
                rowSelection={rowSelection}
                pagination={false}
                locale={{ emptyText: 'No users have access to this inventory' }}
            />

            <Modal
                title="Add User"
                open={modalOpen}
                onCancel={() => {
                    setModalOpen(false);
                    setSearchQuery('');
                    setSearchResults([]);
                }}
                footer={null}
                destroyOnClose
            >
                <Input
                    placeholder="Search by name, email, or username..."
                    prefix={<SearchOutlined />}
                    value={searchQuery}
                    autoComplete="off"
                    onChange={(e) => handleSearchChange(e.target.value)}
                    allowClear
                    autoFocus
                    style={{ marginBottom: 16 }}
                />
                <List
                    loading={searching}
                    locale={{ emptyText: searchQuery.length >= 2 && !searching ? 'No users found' : 'Enter at least 2 characters to search' }}
                    dataSource={searchResults}
                    renderItem={(user) => (
                        <List.Item
                            style={{ cursor: 'pointer', borderRadius: 8, padding: '8px 12px' }}
                            onClick={() => handleGrantAccess(user)}
                            className="access-search-item"
                        >
                            <List.Item.Meta
                                avatar={<Avatar icon={<UserOutlined />} />}
                                title={user.fullName}
                                description={user.email}
                            />
                        </List.Item>
                    )}
                />
            </Modal>
        </div>
    );
};
