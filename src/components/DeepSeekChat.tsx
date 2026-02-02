import { useState } from 'react'
import { Layout, Typography, Input, Space, Select, Button } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { chat } from '../service/api'

const { Content } = Layout
const { Title } = Typography
const { TextArea } = Input



const MODEL_OPTIONS = [
  { label: 'my-deepseek-r1-1.5', value: 'my-deepseek-r1-1.5' },
  { label: '通义千问-Plus', value: '通义千问-Plus' },
  { label: '通义千问-Max', value: '通义千问-Max' },
]

interface DeepSeekChatProps {
  onModelChange?: (model: string) => void
}

export default function DeepSeekChat({ onModelChange }: DeepSeekChatProps) {
  const [message, setMessage] = useState('')
  const [model, setModel] = useState('my-deepseek-r1-1.5')
  const [thinking, setThinking] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleModelChange = (v: string) => {
    setModel(v)
    onModelChange?.(v)
  }

  const handleSend = async () => {
    const prompt = message.trim()
    if (!prompt || loading) return

    setLoading(true)
    setThinking('')
    setResponse('')

    await chat(prompt, {
      model,
      onChunk: ({ thinking: t, response: r, done }) => {
        if (t) setThinking((prev) => prev + t)
        if (r) setResponse((prev) => prev + r)
        if (done) setLoading(false)
      },
      onError: (err: Error) => {
        setResponse(`错误: ${err.message}`)
        setLoading(false)
      },
    })
  }

  return (
    <Layout style={{ height: 'calc(100vh - 180px)', minHeight: 500, background: '#fff' }}>
      <div
        style={{
          padding: '12px 24px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fff',
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          大模型体验
        </Title>
        <Space>
          <span style={{ color: '#666', fontSize: 14 }}>大模型服务：</span>
          <Select
            value={model}
            onChange={handleModelChange}
            style={{ width: 200 }}
            options={MODEL_OPTIONS}
          />
        </Space>
      </div>

      <Content
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#fff',
        }}
      >
        {/* 内容区 */}
        <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          {thinking && (
            <div style={{ color: '#888', fontSize: 14, marginBottom: 12, whiteSpace: 'pre-wrap' }}>
              {thinking}
            </div>
          )}
          {response && (
            <div style={{ whiteSpace: 'pre-wrap' }}>{response}</div>
          )}
        </div>

        {/* 底部输入区 */}
        <div
          style={{
            padding: '16px 24px 24px',
            borderTop: '1px solid #f0f0f0',
            background: '#fff',
          }}
        >
          <div
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: 12,
              padding: 12,
              background: '#fafafa',
            }}
          >
            <TextArea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
              placeholder={`给 ${model} 发送消息`}
              autoSize={{ minRows: 2, maxRows: 6 }}
              bordered={false}
              style={{ background: 'transparent', resize: 'none' }}
              disabled={loading}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={loading}
                onClick={handleSend}
              >
                发送
              </Button>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  )
}
