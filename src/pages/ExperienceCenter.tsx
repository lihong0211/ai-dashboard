import { Typography } from 'antd'
import Chat from '../components/Chat'

const { Title } = Typography

const TAB_LABELS: Record<string, string> = {
  llm: '大模型体验',
  voice: '语音合成',
  video: '视频生成',
}

interface ExperienceCenterProps {
  tab: string
}

export default function ExperienceCenter({ tab }: ExperienceCenterProps) {
  if (tab === 'llm') {
    return <Chat />
  }

  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 8, textAlign: 'center', color: '#999' }}>
      <Title level={4}>{TAB_LABELS[tab] || tab}</Title>
      <p>功能开发中</p>
    </div>
  )
}
