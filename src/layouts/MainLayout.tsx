import { useState } from 'react'
import { Layout, Menu, Button, Typography } from 'antd'
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RobotOutlined,
  FontSizeOutlined,
  SoundOutlined,
  PictureOutlined,
  PlayCircleOutlined,
  ApiOutlined,
  DatabaseOutlined,
  CodeOutlined,
  LinkOutlined,
  ToolOutlined,
  CloudOutlined,
  SwapOutlined,
  ExperimentOutlined,
  BookOutlined,
  AppstoreOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const mainMenuItems = [
  {
    key: 'group-train',
    type: 'group' as const,
    label: '模型训练',
    children: [{ key: 'finetune', icon: <RobotOutlined />, label: '微调训练' }],
  },
]

const experienceMenuItems = [
  {
    key: 'group-experience',
    type: 'group' as const,
    children: [
      { key: '/experience/llm', icon: <FontSizeOutlined />, label: '语言模型' },
      { key: '/experience/orc', icon: <PictureOutlined />, label: 'OCR' },
      { key: '/experience/tts', icon: <SoundOutlined />, label: 'TTS' },
      { key: '/experience/stt', icon: <SoundOutlined />, label: 'STT' },
      { key: '/experience/image_generation', icon: <PictureOutlined />, label: '图片生成' },
      { key: '/experience/video_understanding', icon: <PlayCircleOutlined />, label: '视频理解' },
    ],
  },
]

const skillsMenuItems = [
  {
    key: 'group-skills',
    type: 'group' as const,
    children: [
      { key: '/skills/embedding', icon: <ApiOutlined />, label: 'Embedding' },
      { key: '/skills/rag', icon: <DatabaseOutlined />, label: 'RAG' },
      { key: '/skills/text2sql', icon: <CodeOutlined />, label: 'Text2SQL' },
      { key: '/skills/langchain', icon: <LinkOutlined />, label: 'LangChain' },
      { key: '/skills/function_call', icon: <ToolOutlined />, label: 'Function Call' },
      { key: '/skills/mcp', icon: <CloudOutlined />, label: 'MCP' },
      { key: '/skills/a2a', icon: <SwapOutlined />, label: 'A2A' },
      { key: '/skills/agent', icon: <RobotOutlined />, label: 'Agent' },
      { key: '/skills/finetuning', icon: <ExperimentOutlined />, label: 'Fine-Tuning' },
      { key: '/skills/coze', icon: <AppstoreOutlined />, label: 'Coze' },
      { key: '/skills/dify', icon: <AppstoreOutlined />, label: 'Dify' },
      { key: '/skills/knowledge_base', icon: <BookOutlined />, label: '知识库' },
      { key: '/skills/skills', icon: <ThunderboltOutlined />, label: 'Skills' },
    ],
  },
]

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const isExperience = location.pathname.startsWith('/experience')
  const isSkills = location.pathname.startsWith('/skills')
  const isPortal = location.pathname === '/portal'
  const menuItems = isExperience ? experienceMenuItems : isSkills ? skillsMenuItems : mainMenuItems

  const flatMenuKeys = menuItems.flatMap((group) =>
    (group.children || [])
      .filter((item) => 'key' in item && item.key)
      .map((item) => (item as { key: string }).key)
  )

  const selectedKey =
    flatMenuKeys.find((key) => location.pathname.startsWith(key)) ||
    (isExperience ? '/experience/llm' : isSkills ? '/skills/embedding' : '/dashboard')

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key.startsWith('/')) {
      navigate(key)
    }
  }

  const navLinks = [
    { to: '/experience/llm', label: '体验中心' },
    { to: '/skills/embedding', label: 'Skills' },
    { to: '/portal', label: '门户' },
  ]

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <Layout style={{ height: '100%', minHeight: 0 }}>
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
        <Layout style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
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
              {navLinks.map(({ to, label }) => {
                const active = to.startsWith('/skills')
                  ? location.pathname.startsWith('/skills')
                  : location.pathname.startsWith(to)
                return (
                <Link
                  key={to}
                  to={to}
                  className="header-nav-link"
                  style={{
                    color: active ? 'var(--ds-primary)' : 'var(--ds-text)',
                    padding: '6px 12px',
                    borderRadius: 6,
                    textDecoration: 'none',
                  }}
                >
                  {label}
                </Link>
                )
              })}
            </Header>
          )}
          <Content
            style={{
              margin: isPortal ? 0 : 24,
              padding: isPortal ? 0 : 24,
              minHeight: 280,
              background: isPortal ? '#000' : 'var(--ds-card)',
              ...((isPortal || isExperience || isSkills) && {
                flex: 1,
                minHeight: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }),
            }}
          >
            <div
              style={{
                ...((isPortal || isExperience || isSkills) && { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }),
              }}
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}
