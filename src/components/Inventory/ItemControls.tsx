import React from 'react';
import { Space, Popover, Button, Input, Switch, Segmented, InputNumber, Typography } from 'antd';
import { SmileOutlined, CheckOutlined, EditOutlined } from '@ant-design/icons';
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';
import type { CustomIdItem } from './types';

const { Text } = Typography;

export interface ItemControlsProps {
    item: CustomIdItem;
    editingId: string | null;
    editValue: string;
    onEditValueChange: (val: string) => void;
    onSaveEdit: (id: string) => void;
    onStartEdit: (item: CustomIdItem) => void;
    onUpdateItem: (id: string, updates: Partial<CustomIdItem>) => void;
    onEmojiClick: (emojiData: EmojiClickData) => void;
}

export const ItemControls: React.FC<ItemControlsProps> = ({
    item,
    editingId,
    editValue,
    onEditValueChange,
    onSaveEdit,
    onStartEdit,
    onUpdateItem,
    onEmojiClick,
}) => {
    switch (item.type) {
        case 'Fixed text':
        case 'Date/time':
        case 'Sequence':
            return (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', height: '32px' }}>
                    {editingId === item.id ? (
                        <Space.Compact style={{ width: '100%' }}>
                            {item.type === 'Fixed text' && (
                                <Popover content={<EmojiPicker onEmojiClick={onEmojiClick} />} trigger="click" placement="bottomLeft" zIndex={1000}>
                                    <Button icon={<SmileOutlined />} />
                                </Popover>
                            )}
                            <Input
                                value={editValue}
                                onChange={(e) => onEditValueChange(e.target.value)}
                                onPressEnter={() => onSaveEdit(item.id)}
                                autoFocus
                            />
                            <Button type="primary" icon={<CheckOutlined />} onClick={() => onSaveEdit(item.id)} />
                        </Space.Compact>
                    ) : (
                        <div
                            className="editable-text-container"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                width: '100%',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.currentTarget.classList.add('hovering')}
                            onMouseLeave={(e) => e.currentTarget.classList.remove('hovering')}
                            onClick={() => onStartEdit(item)}
                        >
                            <Text style={{ fontSize: '16px' }}>{item.value}</Text>
                            <EditOutlined
                                className="edit-icon"
                                style={{ color: '#1677ff', opacity: 0, transition: 'opacity 0.2s' }}
                            />
                            <style>{`
                                .editable-text-container:hover { background-color: rgba(0,0,0,0.04); }
                                .editable-text-container.hovering .edit-icon { opacity: 1 !important; }
                            `}</style>
                        </div>
                    )}
                </div>
            );

        case '20-bit random':
            return (
                <Space style={{ flex: 1, justifyContent: 'space-between' }}>
                    <Segmented
                        options={['Hex', 'Decimal', 'Base36']}
                        value={item.format}
                        onChange={(val) => onUpdateItem(item.id, { format: val as string })}
                    />
                    <Space>
                        <Text>Grouping?</Text>
                        <Switch
                            checked={item.isGrouped}
                            onChange={(val) => onUpdateItem(item.id, { isGrouped: val })}
                        />
                    </Space>
                </Space>
            );

        case '32-bit random':
            return (
                <Space style={{ flex: 1, justifyContent: 'space-between' }}>
                    <Segmented
                        options={['Hex', 'Decimal', 'Base36', 'Base62']}
                        value={item.format}
                        onChange={(val) => onUpdateItem(item.id, { format: val as string })}
                    />
                    <Space>
                        <Text>Grouping?</Text>
                        <Switch
                            checked={item.isGrouped}
                            onChange={(val) => onUpdateItem(item.id, { isGrouped: val })}
                        />
                    </Space>
                </Space>
            );

        case '6-digit random':
        case '9-digit random':
            return (
                <Space style={{ flex: 1, justifyContent: 'space-between' }}>
                    <Space>
                        <Text>Leading Zeros:</Text>
                        <InputNumber
                            min={0}
                            max={item.type === '6-digit random' ? 5 : 8}
                            value={item.leadingZeros}
                            onChange={(val) => onUpdateItem(item.id, { leadingZeros: val || 0 })}
                        />
                    </Space>
                    <Space>
                        <Text>Grouping?</Text>
                        <Switch
                            checked={item.isGrouped}
                            onChange={(val) => onUpdateItem(item.id, { isGrouped: val })}
                        />
                    </Space>
                </Space>
            );

        case 'GUID':
            return (
                <Space style={{ flex: 1, justifyContent: 'space-between' }}>
                    <Segmented
                        options={['Uppercase', 'Lowercase']}
                        value={item.format === 'Uppercase' || item.format === 'Lowercase' ? item.format : 'Uppercase'}
                        onChange={(val) => onUpdateItem(item.id, { format: val as string })}
                    />
                    <Space>
                        <Text>Grouping?</Text>
                        <Switch
                            checked={item.isGrouped}
                            onChange={(val) => onUpdateItem(item.id, { isGrouped: val })}
                        />
                    </Space>
                </Space>
            );

        default:
            return null;
    }
};
