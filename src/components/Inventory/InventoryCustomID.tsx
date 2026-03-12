import React, { useState, useContext, useEffect } from 'react';
import { Typography, Button, Select, Space, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { type EmojiClickData } from 'emoji-picker-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableCard } from './SortableCard';
import type { CustomIdItem } from './types';
import { getDefaultValue, generateExample } from './customIdUtils';
import { encodeMask, decodeMask } from './customIdMaskCodec';
import { ItemControls } from './ItemControls';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { patchInventoryLocal } from '../../store/slices/inventorySlice';
import { InventoryDetailContext } from '../../pages/InventoryDetail';

const { Title, Text } = Typography;

export const InventoryCustomID: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const { triggerAutoSave } = useContext(InventoryDetailContext);

    const inventory = useAppSelector((state) =>
        state.inventory.items.find(inv => inv.id === id)
    );

    const [items, setItems] = useState<CustomIdItem[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    // Sync items state when switching inventories
    useEffect(() => {
        if (inventory?.customIdMask) {
            const decoded = decodeMask(inventory.customIdMask);
            setItems(decoded);
        } else {
            setItems([]);
        }
        setEditingId(null);
        setEditValue('');
    }, [id]);

    const updateItems = (newItems: CustomIdItem[]) => {
        setItems(newItems);
        if (id) {
            dispatch(patchInventoryLocal({ id, customIdMask: encodeMask(newItems) }));
            triggerAutoSave();
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            updateItems(arrayMove(items, oldIndex, newIndex));
        }
    };

    const handleAdd = () => {
        updateItems([...items, { id: Date.now().toString(), type: 'Fixed text', value: getDefaultValue('Fixed text'), isGrouped: false, format: 'Hex', leadingZeros: 0 }]);
    };

    const updateItem = (itemId: string, updates: Partial<CustomIdItem>) => {
        updateItems(items.map(item => item.id === itemId ? { ...item, ...updates } : item));
    };

    const removeItem = (itemId: string) => {
        updateItems(items.filter(item => item.id !== itemId));
    };

    const startEdit = (item: CustomIdItem) => {
        setEditingId(item.id);
        setEditValue(item.value);
    };

    const saveEdit = (itemId: string) => {
        updateItem(itemId, { value: editValue });
        setEditingId(null);
    };

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setEditValue(prev => prev + emojiData.emoji);
    };

    return (
        <div>
            {/* <Title level={4}>Inventory Custom ID Configuration</Title> */}
            {/* <p>Configure the custom ID format for items in this inventory.</p> */}

            <div style={{
                padding: '24px',
                backgroundColor: '#fafafa',
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                marginBottom: '24px',
                textAlign: 'center',
                maxWidth: '800px',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
            }}>
                <Text type="secondary" style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px' }}>
                    Example Output
                </Text>
                <Title level={3} style={{ marginTop: '8px', marginBottom: 0, fontFamily: 'monospace', color: '#1677ff', wordBreak: 'break-all' }}>
                    {items.map(generateExample).join('') || '—'}
                </Title>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map(i => i.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <Space direction="vertical" size="middle" style={{ width: '100%', maxWidth: '800px' }}>
                        {items.map((item) => (
                            <SortableCard key={item.id} id={item.id}>
                                <Select
                                    value={item.type}
                                    onChange={(val) => {
                                        const updates: Partial<CustomIdItem> = {
                                            type: val,
                                            format: val === 'GUID' ? 'Uppercase' : 'Hex'
                                        };
                                        if (['Fixed text', 'Sequence', 'Date/time'].includes(val)) {
                                            updates.value = getDefaultValue(val);
                                        }
                                        updateItem(item.id, updates);
                                    }}
                                    style={{ width: 150 }}
                                    options={[
                                        { value: 'Fixed text', label: 'Fixed text' },
                                        { value: '20-bit random', label: '20-bit random' },
                                        { value: '32-bit random', label: '32-bit random' },
                                        { value: '6-digit random', label: '6-digit random' },
                                        { value: '9-digit random', label: '9-digit random' },
                                        { value: 'GUID', label: 'GUID' },
                                        { value: 'Date/time', label: 'Date/time' },
                                        { value: 'Sequence', label: 'Sequence' }
                                    ]}
                                />

                                <ItemControls
                                    item={item}
                                    editingId={editingId}
                                    editValue={editValue}
                                    onEditValueChange={setEditValue}
                                    onSaveEdit={saveEdit}
                                    onStartEdit={startEdit}
                                    onUpdateItem={updateItem}
                                    onEmojiClick={onEmojiClick}
                                />

                                <Popconfirm
                                    title="Remove element"
                                    description="Are you sure you want to remove this element?"
                                    onConfirm={() => removeItem(item.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        danger
                                        icon={<DeleteOutlined />}
                                        type="text"
                                        size="small"
                                    />
                                </Popconfirm>
                            </SortableCard>
                        ))}

                        <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                            block
                        >
                            Add Element
                        </Button>
                    </Space>
                </SortableContext>
            </DndContext>
        </div>
    );
};
