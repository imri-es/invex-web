import React, { useEffect, useState } from 'react';
import { Typography, Table, Button, Space, Modal, Form, Input, InputNumber, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { patchInventoryLocal } from '../../store/slices/inventorySlice';
import api from '../../api/axios';

const { Title } = Typography;

interface FieldDataDto {
    id: string;
    customFieldId: string;
    customFieldName: string;
    customFieldType: string;
    valueString?: string;
    valueNumeric?: number;
    valueBoolean?: boolean;
}

interface ItemDto {
    id: string;
    customID: string;
    inventoryId: string;
    name: string;
    description?: string;
    image?: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    fieldData: FieldDataDto[];
}

export const InventoryItems: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const [items, setItems] = useState<ItemDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const inventory = useAppSelector((state) =>
        state.inventory.items.find(inv => inv.id === id)
    );
    const fields = inventory?.fields;

    // Fetch custom fields if not yet loaded in Redux
    useEffect(() => {
        if (id && !fields) {
            api.get(`/inventories/${id}/fields`)
                .then(res => {
                    dispatch(patchInventoryLocal({ id, fields: res.data }));
                })
                .catch(err => {
                    console.error("Failed to load fields for items tab", err);
                });
        }
    }, [id, fields, dispatch]);

    const [tableParams, setTableParams] = useState<any>({
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0,
            showSizeChanger: true,
        },
    });
    const [searchText, setSearchText] = useState('');

    const fetchItems = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const { current, pageSize } = tableParams.pagination;
            const sortField = tableParams.sortField;
            const sortOrder = tableParams.sortOrder;

            let query = `?page=${current}&pageSize=${pageSize}`;

            if (searchText) {
                query += `&search=${encodeURIComponent(searchText)}`;
            }

            if (sortField) {
                query += `&sortBy=${sortField}`;
                if (sortOrder === 'descend') {
                    query += `&sortDesc=true`;
                }
            }

            const res = await api.get(`/inventories/${id}/items${query}`);

            setItems(res.data.items || []);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: res.data.totalCount || 0,
                },
            });
        } catch (error) {
            console.error("Failed to fetch items", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [id, tableParams.pagination.current, tableParams.pagination.pageSize, tableParams.sortField, tableParams.sortOrder, searchText]);

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        setTableParams({
            pagination,
            filters,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
        });
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
        setTableParams({
            ...tableParams,
            pagination: {
                ...tableParams.pagination,
                current: 1, // Reset to first page
            },
        });
    };

    const handleCreate = async (values: any) => {
        if (!id) return;
        setIsSubmitting(true);
        try {
            // Extract core fields
            const payload: any = {
                name: values.name,
                description: values.description,
                quantity: values.quantity || 0,
                fieldData: []
            };

            // Extract custom fields values
            if (inventory?.fields) {
                inventory.fields.forEach(f => {
                    if (f.id && values[`custom_${f.id}`] !== undefined) {
                        const fd: any = { customFieldId: f.id };
                        if (f.type === 'Numeric') fd.valueNumeric = values[`custom_${f.id}`];
                        else if (f.type === 'Boolean') fd.valueBoolean = values[`custom_${f.id}`];
                        else fd.valueString = values[`custom_${f.id}`];
                        payload.fieldData.push(fd);
                    }
                });
            }

            await api.post(`/inventories/${id}/items`, payload);
            setIsModalVisible(false);
            form.resetFields();
            fetchItems();
        } catch (error) {
            console.error("Failed to create item", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Build base columns
    const columns: any[] = [
        { title: 'Custom ID', dataIndex: 'customID', key: 'customID', sorter: true },
        { title: 'Name', dataIndex: 'name', key: 'name', sorter: true },
        { title: 'Description', dataIndex: 'description', key: 'description', sorter: true },
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', sorter: true }
    ];

    // Append dynamic columns for displayable custom fields
    if (inventory?.fields) {
        inventory.fields.filter(f => f.isDisplay).forEach(f => {
            columns.push({
                title: f.name,
                key: `custom_${f.id}`,
                dataIndex: `custom_${f.id}`, // Required by antd for correct sorting field detection
                sorter: true,
                render: (_: any, record: ItemDto) => {
                    const fd = record.fieldData.find(d => d.customFieldId === f.id);
                    if (!fd) return '-';
                    if (f.type === 'Numeric') return fd.valueNumeric;
                    if (f.type === 'Boolean') return fd.valueBoolean ? 'Yes' : 'No';
                    return fd.valueString || '-';
                }
            });
        });
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>Inventory Items</Title>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Input.Search
                        placeholder="Search items..."
                        allowClear
                        onSearch={handleSearch}
                        style={{ width: 250 }}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                        Add New
                    </Button>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={items}
                rowKey="id"
                loading={isLoading}
                pagination={tableParams.pagination}
                onChange={handleTableChange}
            />

            <Modal
                title="Add New Item"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                confirmLoading={isSubmitting}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleCreate}>
                    <Form.Item name="name" label="Item Name" rules={[{ required: true, message: 'Please enter item name' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="quantity" label="Quantity" initialValue={0}>
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    {inventory?.fields?.map(f => {
                        let innerInput = <Input />;
                        if (f.type === 'Numeric') innerInput = <InputNumber style={{ width: '100%' }} />;
                        else if (f.type === 'Boolean') innerInput = <Switch />;
                        else if (f.type === 'MultiLine') innerInput = <Input.TextArea />;

                        return (
                            <Form.Item
                                key={f.id}
                                name={`custom_${f.id}`}
                                label={f.name}
                                valuePropName={f.type === 'Boolean' ? 'checked' : 'value'}
                            >
                                {innerInput}
                            </Form.Item>
                        );
                    })}
                </Form>
            </Modal>
        </div>
    );
};
