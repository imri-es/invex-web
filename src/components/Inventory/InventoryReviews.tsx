import React, { useState, useEffect } from 'react';
import { Typography, Space, Spin, message } from 'antd';
import { useParams } from 'react-router-dom';
import { ReviewCard, type ReviewData } from './ReviewCard';
import { ReviewComposer } from './ReviewComposer';
import api from '../../api/axios';

const { Title, Paragraph } = Typography;

export const InventoryReviews: React.FC = () => {
    const { id: inventoryId } = useParams<{ id: string }>();
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async (isBackgroundPolling = false) => {
        if (!inventoryId) return;
        try {
            if (!isBackgroundPolling) setLoading(true);
            const response = await api.get(`/inventories/${inventoryId}/posts`);
            if (response.data && response.data.items) {
                // Map backend DTO to frontend ReviewData format
                const mappedReviews: ReviewData[] = response.data.items.map((item: any) => ({
                    id: item.id,
                    fullName: item.fullName,
                    username: item.userName,
                    content: item.content,
                    likes: item.likesCount,
                    isLikedByMe: item.isLikedByCurrentUser,
                    date: item.createdAt
                }));
                // Only update state if data actually changed to prevent unnecessary re-renders
                // A simple JSON.stringify comparison works here, though deep equal is better for complex objects
                setReviews(prev => {
                    const stringifiedPrev = JSON.stringify(prev);
                    const stringifiedNew = JSON.stringify(mappedReviews);
                    return stringifiedPrev === stringifiedNew ? prev : mappedReviews;
                });
            }
        } catch (err) {
            console.error('Failed to fetch posts:', err);
            // Only show error toasts on initial load, not background polls
            if (!isBackgroundPolling) {
                setError('Failed to load reviews.');
                message.error('Failed to load reviews');
            }
        } finally {
            if (!isBackgroundPolling) setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();

        // Setup 3-second polling
        const intervalId = setInterval(() => {
            fetchPosts(true);
        }, 3000);

        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
    }, [inventoryId]);

    const handleLikeToggle = async (id: string) => {
        if (!inventoryId) return;
        try {
            // Optimistic update
            setReviews(prev => prev.map(review => {
                if (review.id === id) {
                    const isLiked = !review.isLikedByMe;
                    return {
                        ...review,
                        isLikedByMe: isLiked,
                        likes: isLiked ? review.likes + 1 : review.likes - 1
                    };
                }
                return review;
            }));

            // API Call
            await api.put(`/inventories/${inventoryId}/posts/${id}/like`);
        } catch (err) {
            console.error('Failed to toggle like:', err);
            // Revert optimistic update on failure by re-fetching
            message.error('Failed to update like status');
            fetchPosts();
        }
    };

    const handleAddReview = async (content: string) => {
        if (!inventoryId) return;
        try {
            const response = await api.post(`/inventories/${inventoryId}/posts`, { content });
            if (response.data) {
                const newReview: ReviewData = {
                    id: response.data.id,
                    fullName: response.data.fullName,
                    username: response.data.userName,
                    content: response.data.content,
                    likes: response.data.likesCount,
                    isLikedByMe: response.data.isLikedByCurrentUser,
                    date: response.data.createdAt
                };
                setReviews(prev => [newReview, ...prev]);
                message.success('Review posted successfully!');
            }
        } catch (err) {
            console.error('Failed to create post:', err);
            message.error('Failed to create review post.');
        }
    };

    return (
        <div style={{
            maxWidth: 800,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 200px)', // Rough calculation to fit within the viewport under tabs
            position: 'relative'
        }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 4px', paddingBottom: 24 }}>
                <div style={{ marginBottom: 24 }}>
                    <Title level={4}>Inventory Reviews</Title>
                    <Paragraph type="secondary" style={{ fontSize: 15 }}>
                        See what others are saying about this inventory.
                    </Paragraph>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <Spin size="large" />
                    </div>
                ) : error ? (
                    <Typography.Text type="danger">{error}</Typography.Text>
                ) : (
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {reviews.map(review => (
                            <ReviewCard key={review.id} review={review} onLikeToggle={handleLikeToggle} />
                        ))}
                        {reviews.length === 0 && (
                            <Typography.Text type="secondary">No reviews yet. Be the first to post!</Typography.Text>
                        )}
                    </Space>
                )}
            </div>

            <div style={{
                position: 'sticky',
                bottom: 0,
                backgroundColor: 'var(--ant-color-bg-container, #ffffff)',
                paddingTop: 16,
                zIndex: 10
            }}>
                <ReviewComposer
                    onSubmit={handleAddReview}
                />
            </div>
        </div>
    );
};
