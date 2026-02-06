import { useState, useRef, useEffect } from 'react'
import { Layout, Typography, Input, Button, message } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { ttsSynthesize } from '../service/tts'

const { Content } = Layout
const { Title } = Typography
const { TextArea } = Input

export default function TTS() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const objectUrlRef = useRef<string | null>(null)

  const stopAudio = () => {
    const a = audioRef.current
    if (a) {
      a.pause()
      a.currentTime = 0
      audioRef.current = null
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setPlaying(false)
    setText('')
  }

  useEffect(() => {
    return stopAudio
  }, [])

  const handleSubmit = async () => {
    const trimmed = text.trim()
    if (!trimmed) {
      message.warning('请输入要合成的文字')
      return
    }
    if (loading || playing) return
    setError(null)
    stopAudio()
    setLoading(true)
    try {
      const blob = await ttsSynthesize(trimmed)
      const url = URL.createObjectURL(blob)
      objectUrlRef.current = url
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => stopAudio()
      audio.onerror = () => {
        message.error('播放失败')
        stopAudio()
      }
      setLoading(false)
      setPlaying(true)
      await audio.play()
    } catch (e) {
      setLoading(false)
      const msg = e instanceof Error ? e.message : String(e)
      setError(msg)
      message.error(msg)
    }
  }

  return (
    <Layout
      style={{
        height: '100%',
        minHeight: 400,
        background: 'transparent',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'transparent',
        }}
      >
        <Title level={5} style={{ margin: 0, color: 'var(--ds-text)', fontWeight: 600 }}>
          文字转语音 (TTS)
        </Title>
        <span style={{ fontSize: 14, color: 'var(--ds-text-muted)' }}>edge-tts</span>
      </div>

      <Content
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'transparent',
        }}
      >
        {/* 中间：发送后展示 waves，与 Chat 一致留出 24 边距 */}
        <div
          style={{
            flex: 1,
            minHeight: 200,
            position: 'relative',
            overflow: 'hidden',
            padding: 24,
          }}
        >
          {(loading || playing) && (
            <iframe
              src={`/waves.html?color=1296db`}
              title="语音波形"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                border: 'none',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>

        {error && (
          <div style={{ padding: '0 24px', color: 'var(--ds-primary)', marginBottom: 8, fontSize: 14, textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* 底部输入区：与 Chat 同宽同位置，padding 16px 24px 24px */}
        <div
          style={{
            padding: '16px 24px 24px',
            background: 'transparent',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              borderRadius: 12,
              padding: '12px 14px',
              background: 'var(--ds-bg)',
              border: 'none',
              boxShadow: 'none',
            }}
          >
            <TextArea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault()
                  handleSubmit()
                }
              }}
              placeholder="输入要转换的文字，回车或点击发送"
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
                onClick={handleSubmit}
                disabled={playing}
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

      <style>{`
        @keyframes tts-bar {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </Layout>
  )
}
