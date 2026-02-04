import { useState } from 'react'
import { Layout, Menu, Button, Typography } from 'antd'
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ExperimentOutlined,
  CodeOutlined,
  GlobalOutlined,
  RobotOutlined,
  FontSizeOutlined,
  SoundOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const mainMenuItems = [
  {
    key: 'group-main',
    type: 'group' as const,
    label: '',
    children: [
      { key: '/dashboard', icon: <DashboardOutlined />, label: '模型广场' },
      { key: '/models', icon: <ExperimentOutlined />, label: '模型管理' },
      { key: '/workbench', icon: <CodeOutlined />, label: '工作台' },
      { key: '/experience/llm', icon: <FontSizeOutlined />, label: '体验中心' },
      { key: '/portal', icon: <GlobalOutlined />, label: '门户' },
    ],
  },
  {
    key: 'group-train',
    type: 'group' as const,
    label: '模型训练',
    children: [{ key: 'finetune', icon: <RobotOutlined />, label: '微调训练' }],
  },
]

const experienceMenuItems = [
  {
    key: 'group-experience-tabs',
    type: 'group' as const,
    label: '',
    children: [
      { key: '/experience/llm', icon: <FontSizeOutlined />, label: '大模型体验' },
      { key: '/experience/voice', icon: <SoundOutlined />, label: '语音合成' },
      { key: '/experience/video', icon: <PlayCircleOutlined />, label: '视频生成' },
    ],
  },
]

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const isExperience = location.pathname.startsWith('/experience')
  const isPortal = location.pathname === '/portal'
  const menuItems = isExperience ? experienceMenuItems : mainMenuItems

  const flatMenuKeys = menuItems.flatMap((group) =>
    (group.children || [])
      .filter((item) => 'key' in item && item.key)
      .map((item) => (item as { key: string }).key)
  )

  const selectedKey =
    flatMenuKeys.find((key) => location.pathname.startsWith(key)) ||
    (isExperience ? '/experience/llm' : '/dashboard')

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key.startsWith('/')) {
      navigate(key)
    }
  }

  const navLinks = [
    { to: '/dashboard', label: '模型广场' },
    { to: '/models', label: '模型管理' },
    { to: '/workbench', label: '工作台' },
    { to: '/experience/llm', label: '体验中心' },
    { to: '/portal', label: 'AI 门户' },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout>
        {!isPortal && (
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={220}
            style={{ background: '#f5f7fa' }}
          >
            <div
              style={{
                height: 56,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 16,
                background: '#f5f7fa',
              }}
            >
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: 18 }}
              />
              {!collapsed && (
                <Text strong style={{ marginLeft: 8 }}>
                  AI 实验室
                </Text>
              )}
            </div>
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              onClick={handleMenuClick}
              style={{
                height: 'calc(100vh - 56px)',
                borderRight: 0,
                paddingTop: 8,
                background: '#f5f7fa',
              }}
              items={menuItems}
            />
          </Sider>
        )}
        <Layout>
          {!isPortal && (
            <Header
              style={{
                padding: '0 24px',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: 24,
              }}
            >
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="header-nav-link"
                  style={{
                    color: location.pathname.startsWith(to) ? 'var(--ds-primary)' : 'var(--ds-text)',
                    padding: '6px 12px',
                    borderRadius: 6,
                    textDecoration: 'none',
                  }}
                >
                  {label}
                </Link>
              ))}
            </Header>
          )}
          <Content
            style={{
              margin: isPortal ? 0 : 24,
              padding: isPortal ? 0 : 24,
              minHeight: 280,
              background: isPortal ? '#000' : 'var(--ds-card)',
              ...(isPortal && { height: 'calc(100vh - 64px)' }),
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}
