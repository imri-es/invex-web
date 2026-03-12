import React from 'react';
import { Card, Avatar, Typography, Space, Button } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { stringToColor } from '../../utils/colorUtils';

const { Text, Paragraph } = Typography;

export interface ReviewData {
    id: string;
    fullName: string;
    username: string;
    content: string;
    likes: number;
    isLikedByMe: boolean;
    date: string;
}

interface ReviewCardProps {
    review: ReviewData;
    onLikeToggle: (id: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onLikeToggle }) => {
    const avatarColor = stringToColor(review.username || review.fullName);

    return (
        <Card
            style={{ marginBottom: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}
            styles={{ body: { padding: 20 } }}
        >
            <div style={{ display: 'flex', gap: 16 }}>
                <Avatar size={48} style={{ backgroundColor: avatarColor }}>
                    {review.fullName.charAt(0).toUpperCase()}
                </Avatar>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <Text strong style={{ fontSize: 16 }}>{review.fullName}</Text>
                            <br />
                            <Text type="secondary">@{review.username}</Text>
                        </div>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            {new Date(review.date).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Text>
                    </div>
                    <Paragraph style={{ marginTop: 12, fontSize: 15, lineHeight: 1.6 }}>
                        {review.content}
                    </Paragraph>
                    <Space style={{ marginTop: 8 }}>
                        <Button
                            type="text"
                            icon={review.isLikedByMe ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                            onClick={() => onLikeToggle(review.id)}
                            style={{
                                padding: '4px 8px',
                                color: review.isLikedByMe ? '#ff4d4f' : undefined,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6
                            }}
                        >
                            {review.likes}
                        </Button>
                    </Space>
                </div>
            </div>
        </Card>
    );
};
