import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Layout, Typography, Input, Space, Select, Button, Image } from 'antd'
import { SendOutlined, ScanOutlined } from '@ant-design/icons'
import { chat, type ChatMessage } from '../service/api'

const { Content } = Layout
const { Title } = Typography
const { TextArea } = Input

/** 前端展示用：带图片预览 URL，不发给后端 */
type DisplayMessage = ChatMessage & { imagePreview?: string }

const MODEL_OPTIONS = [
  { label: 'my-deepseek-r1-1.5', value: 'my-deepseek-r1-1.5' },
  { label: 'deepseek-r1:latest', value: 'deepseek-r1:latest' },
  { label: 'deepseek-ocr', value: 'deepseek-ocr:latest' },
  { label: 'qwen3:1.7b', value: 'qwen3:1.7b' },
]

/** 将 File 转为纯 base64 字符串（不含 data URL 前缀），供 Ollama 使用 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl
      resolve(base64 || '')
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

interface ChatProps {
  onModelChange?: (model: string) => void
}

export default function Chat({ onModelChange }: ChatProps) {
  const [message, setMessage] = useState('')
  const [model, setModel] = useState('my-deepseek-r1-1.5')
  const [messages, setMessages] = useState<DisplayMessage[]>([])
  const [thinking, setThinking] = useState('')
  const [streamingResponse, setStreamingResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesRef = useRef<DisplayMessage[]>([])
  const streamedContentRef = useRef('')
  const doneHandledRef = useRef(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingResponse, thinking])

  const handleModelChange = (v: string) => {
    setModel(v)
    onModelChange?.(v)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/') || loading) return
    e.target.value = ''
    const preview = URL.createObjectURL(file)
    fileToBase64(file).then((base64) => {
      setModel('deepseek-ocr:latest')
      onModelChange?.('deepseek-ocr:latest')
      const userMessage: DisplayMessage = {
        role: 'user',
        content: '请识别图中的文字',
        images: [''],
        imagePreview: preview,
      }
      setMessages((prev) => [...prev, userMessage])
      setLoading(true)
      setThinking('')
      setStreamingResponse('')
      streamedContentRef.current = ''
      doneHandledRef.current = false
      const history = messagesRef.current.map(({ imagePreview: _, ...m }) => m)
      chat('请识别图中的文字', {
        model: 'deepseek-ocr:latest',
        messages: history,
        images: [base64],
        onChunk: ({ thinking: t, response: r, done }) => {
          if (t) setThinking((prev) => prev + t)
          if (r) {
            streamedContentRef.current += r
            setStreamingResponse(streamedContentRef.current)
          }
          if (done && !doneHandledRef.current) {
            doneHandledRef.current = true
            setMessages((prev) => [...prev, { role: 'assistant', content: streamedContentRef.current }])
            setThinking('')
            setStreamingResponse('')
            setLoading(false)
          }
        },
        onError: (err: Error) => {
          setMessages((prev) => [...prev, { role: 'assistant', content: `错误: ${err.message}` }])
          setThinking('')
          setStreamingResponse('')
          setLoading(false)
        },
      })
    })
  }

  const handleSend = async () => {
    const prompt = message.trim()
    if (!prompt || loading) return

    setLoading(true)
    setThinking('')
    setStreamingResponse('')
    setMessage('')
    streamedContentRef.current = ''
    doneHandledRef.current = false

    const userMessage: DisplayMessage = { role: 'user', content: prompt }
    setMessages((prev) => [...prev, userMessage])

    const history = messagesRef.current.map(({ imagePreview: _, ...m }) => m)
    await chat(prompt, {
      model,
      messages: history,
      onChunk: ({ thinking: t, response: r, done }) => {
        if (t) setThinking((prev) => prev + t)
        if (r) {
          streamedContentRef.current += r
          setStreamingResponse(streamedContentRef.current)
        }
        if (done && !doneHandledRef.current) {
          doneHandledRef.current = true
          setMessages((prev) => [...prev, { role: 'assistant', content: streamedContentRef.current }])
          setThinking('')
          setStreamingResponse('')
          setLoading(false)
        }
      },
      onError: (err: Error) => {
        setMessages((prev) => [...prev, { role: 'assistant', content: `错误: ${err.message}` }])
        setThinking('')
        setStreamingResponse('')
        setLoading(false)
      },
    })
  }

  return (
    <Layout
      className="chat-layout"
      style={{
        height: 'calc(100vh - 64px)',
        minHeight: 500,
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        className="chat-header"
        style={{
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'transparent',
        }}
      >
        <Title level={5} style={{ margin: 0, color: 'var(--ds-text)', fontWeight: 600 }}>
          大模型体验
        </Title>
        <Space align="center">
          <span style={{ color: 'var(--ds-text-muted)', fontSize: 14, fontWeight: 500 }}>
            大模型服务：
          </span>
          <Select
            value={model}
            onChange={handleModelChange}
            style={{ width: 200 }}
            options={MODEL_OPTIONS}
            className="chat-model-select"
          />
        </Space>
      </div>

      <Content
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'transparent',
        }}
      >
        <div
          className="chat-messages"
          style={{
            flex: 1,
            overflow: 'auto',
            padding: 24,
            scrollBehavior: 'smooth',
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 16,
              }}
            >
              <div
                className={m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}
                style={{
                  maxWidth: '78%',
                  padding: m.role === 'user' ? '12px 16px' : '14px 16px',
                  background:
                    m.role === 'user'
                      ? 'var(--ds-user-bubble)'
                      : 'var(--ds-bg-chat)',
                  borderRadius: 12,
                }}
              >
                {m.role === 'user' ? (
                  m.imagePreview ? (
                    <Image
                      src={m.imagePreview}
                      alt=""
                      style={{ maxWidth: 280, maxHeight: 280, borderRadius: 8 }}
                    />
                  ) : (
                    <div style={{ whiteSpace: 'pre-wrap', color: 'var(--ds-text)', lineHeight: 1.6 }}>
                      {m.content}
                    </div>
                  )
                ) : (
                  <div className="markdown-body" style={{ lineHeight: 1.65, color: 'var(--ds-text)' }}>
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          {thinking && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  maxWidth: '78%',
                  color: 'var(--ds-text-muted)',
                  fontSize: 13,
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.5,
                  padding: '8px 12px',
                  background: 'var(--ds-user-bubble)',
                  borderRadius: 8,
                }}
              >
                {thinking}
              </div>
            </div>
          )}
          {streamingResponse && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
              <div
                className="chat-bubble-assistant"
                style={{
                  maxWidth: '78%',
                  padding: '14px 16px',
                  background: 'var(--ds-bg-chat)',
                  borderRadius: 12,
                }}
              >
                <div
                  className="markdown-body"
                  style={{ lineHeight: 1.65, color: 'var(--ds-text)' }}
                >
                  <ReactMarkdown>{streamingResponse}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div
          className="chat-input-wrap"
          style={{
            padding: '16px 24px 24px',
            background: 'transparent',
            display: 'flex',
            alignItems: 'flex-end',
            gap: 12,
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <Button
            type="text"
            icon={<ScanOutlined style={{ fontSize: 20 }} />}
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            style={{
              color: 'var(--ds-text-muted)',
              width: 40,
              height: 40,
              minWidth: 40,
              padding: 0,
              border: 'none',
              boxShadow: 'none',
            }}
            title="识图（选中后直接发送 OCR）"
          />
          <div
            style={{
              flex: 1,
              borderRadius: 12,
              padding: '12px 14px',
              background: 'var(--ds-bg)',
              border: 'none',
              boxShadow: 'none',
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
              style={{
                background: 'transparent',
                resize: 'none',
                color: 'var(--ds-text)',
              }}
              disabled={loading}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={loading}
                onClick={handleSend}
                className="chat-send-btn"
                style={{
                  background: 'var(--ds-primary)',
                  borderColor: 'var(--ds-primary)',
                  fontWeight: 500,
                  minWidth: 88,
                }}
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
