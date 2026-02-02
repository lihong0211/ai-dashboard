import { useState } from 'react'
import { Typography, Select, Space } from 'antd'
import DeepSeekChat from '../components/DeepSeekChat'

const { Title } = Typography

const TAB_LABELS: Record<string, string> = {
  llm: '大模型体验',
  voice: '语音合成',
  video: '视频生成',
}

const MODEL_OPTIONS = [
  { label: 'my-deepseek-r1-1.5', value: 'my-deepseek-r1-1.5' },
  { label: '通义千问-Plus', value: '通义千问-Plus' },
  { label: '通义千问-Max', value: '通义千问-Max' },
]

interface ExperienceCenterProps {
  tab: string
}

export default function ExperienceCenter({ tab }: ExperienceCenterProps) {
  const [model, setModel] = useState<string>('my-deepseek-r1-1.5')

  if (tab === 'llm') {
    return model === 'my-deepseek-r1-1.5' ? (
      <DeepSeekChat onModelChange={setModel} />
    ) : (
      <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
        <Title level={3} style={{ marginBottom: 16 }}>
          大模型体验
        </Title>
        <Space direction="vertical" size="large">
          <Space align="center">
            <span>大模型服务：</span>
            <Select
              value={model}
              onChange={setModel}
              style={{ width: 220 }}
              options={MODEL_OPTIONS}
            />
          </Space>
          <div style={{ textAlign: 'center', padding: 48, color: '#999' }}>
            欢迎使用 {model}
          </div>
        </Space>
      </div>
    )
  }

  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 8, textAlign: 'center', color: '#999' }}>
      <Title level={4}>{TAB_LABELS[tab] || tab}</Title>
      <p>功能开发中</p>
    </div>
  )
}
