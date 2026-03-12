import React, { useState } from 'react';
import { Card, Input, Button, Avatar } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { stringToColor } from '../../utils/colorUtils';
import { useAppSelector } from '../../store/hooks';

const { TextArea } = Input;

interface ReviewComposerProps {
    onSubmit: (content: string) => void;

}

export const ReviewComposer: React.FC<ReviewComposerProps> = ({
    onSubmit,
}) => {
    const [content, setContent] = useState('');
    const user = useAppSelector(state => state.auth.user);
    const handleSubmit = () => {
        if (content.trim()) {
            onSubmit(content.trim());
            setContent('');
        }
    };

    const avatarColor = stringToColor(user.email);

    return (
        <Card
            style={{
                borderRadius: 12,
                boxShadow: '0 -4px 12px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0',
                borderBottom: 'none',
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0
            }}
            styles={{ body: { padding: 16 } }}
        >
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <Avatar size={40} style={{ backgroundColor: avatarColor, flexShrink: 0 }}>
                    {(user.name).charAt(0).toUpperCase()}
                </Avatar>
                <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                    <TextArea
                        placeholder="Write a review..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        style={{ borderRadius: 8 }}
                        onPressEnter={(e) => {
                            if (!e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSubmit}
                        disabled={!content.trim()}
                        style={{ borderRadius: 8, height: 'unset' }}
                    >
                        Post
                    </Button>
                </div>
            </div>
        </Card>
    );
};
