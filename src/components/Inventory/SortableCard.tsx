import React from 'react';
import { Card } from 'antd';
import { HolderOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableCardProps {
    id: string;
    children: React.ReactNode;
}

export const SortableCard: React.FC<SortableCardProps> = ({ id, children }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : 1,
        position: isDragging ? 'relative' : ('static' as any),
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            size="small"
            bodyStyle={{ display: 'flex', alignItems: 'center', gap: '16px' }}
        >
            <div
                {...attributes}
                {...listeners}
                style={{
                    cursor: 'grab',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    marginLeft: '-8px' // Slightly offset left to align nicely
                }}
            >
                <HolderOutlined style={{ fontSize: '18px', color: '#999' }} />
            </div>
            {children}
        </Card>
    );
};
