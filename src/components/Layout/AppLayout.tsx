import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    HomeOutlined,
    LoginOutlined,
    LogoutOutlined,
    SettingOutlined,
    AppstoreOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMobile } from '../../hooks/useMobile';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import logo from '../../assets/logo.svg';

const { Header, Sider, Content } = Layout;

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const isMobile = useMobile();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const inventories = useAppSelector((state) => state.inventory.items);

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(logout());
        navigate('/login');
    };

    const menuItems = [
        {
            key: '/',
            icon: <HomeOutlined />,
            label: 'Main',
            onClick: () => navigate('/'),
        },
        ...(isAuthenticated ? [
            {
                key: '/dashboard',
                icon: <DashboardOutlined />,
                label: 'Dashboard',
                onClick: () => navigate('/dashboard'),
            },
            {
                key: '/inventories-group',
                icon: <AppstoreOutlined />,
                label: 'Inventories',
                onTitleClick: () => navigate('/inventories'),
                children: inventories.length > 0 ? inventories.map(inv => ({
                    key: `/inventories/${inv.id}`,
                    label: inv.name,
                    onClick: () => navigate(`/inventories/${inv.id}`),
                })) : undefined,
                onClick: inventories.length === 0 ? () => navigate('/inventories') : undefined,
            }
        ] : [])
    ];

    const bottomMenuItems = [
        ...(isAuthenticated ? [
            {
                key: '/settings',
                icon: <SettingOutlined />,
                label: 'Settings',
                onClick: () => navigate('/settings'),
            },
            {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Log Out',
                onClick: handleLogout,
                danger: true,
                style: { marginTop: 'auto', color: '#ff4d4f' }
            }
        ] : [
            {
                key: '/login',
                icon: <LoginOutlined />,
                label: 'Login / Register',
                onClick: () => navigate('/login'),
                danger: true,
                style: { marginTop: 'auto', color: '#ff4d4f' }
            }
        ])
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={isMobile ? true : collapsed}
                breakpoint="md"
                collapsedWidth={isMobile ? 0 : 80}
                style={{ background: '#fff' }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }}>
                        <img src={logo} style={{ position: "absolute", top: "20px", left: "20px", height: "30px", zIndex: 1 }} />
                    </div >
                    <Menu
                        theme="light"
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        openKeys={['/inventories-group']}
                        items={menuItems}
                        style={{ borderRight: 0, flex: 1 }}
                    />
                    <Menu
                        theme="light"
                        mode="inline"
                        selectable={false}
                        items={bottomMenuItems}
                        style={{ borderRight: 0 }}
                    />
                </div>
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: '#fff' }}>
                    {isMobile && (
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                    )}

                    {/* later add language selector and user profile
                        add mobile menu collapse 
                    */}
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: '#fff',
                        borderRadius: 8,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};
