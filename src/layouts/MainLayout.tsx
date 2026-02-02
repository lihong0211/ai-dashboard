import { useState } from 'react'
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Layout,
  Menu,
  Button,
  Space,
  Typography,
  FloatButton,
} from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
  SoundOutlined,
  EyeOutlined,
  AppstoreOutlined,
  DashboardOutlined,
  RobotOutlined,
  CloudOutlined,
  SettingOutlined,
  CustomerServiceOutlined,
  ExperimentOutlined,
  FontSizeOutlined,
  PlayCircleOutlined,
  DesktopOutlined,
  MobileOutlined,
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const mainMenuItems = [
  {
    key: 'group-experience',
    type: 'group' as const,
    label: '模型体验',
    children: [
      { key: '/dashboard', icon: <ThunderboltOutlined />, label: '模型广场' },
      { key: '/experience', icon: <ExperimentOutlined />, label: '体验中心' },
      { key: '/models', icon: <FileTextOutlined />, label: '文本模型' },
      { key: 'voice', icon: <SoundOutlined />, label: '语音模型' },
      { key: 'vision', icon: <EyeOutlined />, label: '视觉模型' },
      { key: 'multimodal', icon: <AppstoreOutlined />, label: '全模态模型' },
    ],
  },
  {
    key: 'group-train',
    type: 'group' as const,
    label: '模型训练',
    children: [{ key: 'finetune', icon: <RobotOutlined />, label: '微调训练' }],
  },
  {
    key: 'group-work',
    type: 'group' as const,
    label: '工作台',
    children: [{ key: '/workbench', icon: <DashboardOutlined />, label: '工作台' }],
  },
  {
    key: 'group-monitor',
    type: 'group' as const,
    label: '模型监控',
    children: [{ key: 'monitor', icon: <CloudOutlined />, label: '监控中心' }],
  },
  {
    key: 'group-settings',
    type: 'group' as const,
    label: '权限管理',
    children: [{ key: 'permission', icon: <SettingOutlined />, label: '权限设置' }],
  },
]

const experienceMenuItems = [
  {
    key: 'group-experience-tabs',
    type: 'group' as const,
    label: '体验中心',
    children: [
      { key: '/experience/llm', icon: <FontSizeOutlined />, label: '大模型体验' },
      { key: '/experience/voice', icon: <SoundOutlined />, label: '语音合成' },
      { key: '/experience/video', icon: <PlayCircleOutlined />, label: '视频生成' },
      { key: '/experience/computer', icon: <DesktopOutlined />, label: 'Computer Use' },
      { key: '/experience/mobile', icon: <MobileOutlined />, label: 'Mobile Use' },
    ],
  },
]

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const isExperience = location.pathname.startsWith('/experience')
  const menuItems = isExperience ? experienceMenuItems : mainMenuItems

  const flatMenuKeys = menuItems.flatMap((group) =>
    (group.children || [])
      .filter((item) => 'key' in item && item.key)
      .map((item) => (item as { key: string }).key)
  )

  const selectedKey = flatMenuKeys.find((key) => location.pathname.startsWith(key)) || (isExperience ? '/experience/llm' : '/dashboard')

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key.startsWith('/')) {
      navigate(key)
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={220}
          style={{ background: '#fff' }}
        >
          <div
            style={{
              height: 56,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 16,
              borderBottom: '1px solid #f0f0f0',
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
            style={{ height: 'calc(100vh - 56px)', borderRight: 0, paddingTop: 8 }}
            items={menuItems}
          />
        </Sider>

        <Layout>
          <Header
            style={{
              padding: '0 24px',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            <Space size="large">
              <Link to="/experience/llm" style={{ color: location.pathname.startsWith('/experience') ? '#1677ff' : 'inherit' }}>
                体验中心
              </Link>
              <Link to="#" style={{ color: 'inherit' }}>
                文档
              </Link>
              <Link to="#" style={{ color: 'inherit' }}>
                API 参考
              </Link>
            </Space>

          </Header>

          <Content style={{ margin: 24, background: '#f5f5f5', padding: 24, minHeight: 280, overflow: 'auto' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>

      {/* 右侧固定按钮 */}
      <FloatButton.Group
        shape="square"
        style={{ right: 24, bottom: 100 }}
        icon={<CustomerServiceOutlined />}
      >
        <FloatButton tooltip="在线咨询" />
        <FloatButton tooltip="AI 助理" icon={<RobotOutlined />} />
      </FloatButton.Group>
    </Layout>
  )
}
