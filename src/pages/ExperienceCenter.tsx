import type { ComponentType } from 'react'
import { Typography } from 'antd'
import Chat from '../components/Chat'
import OCR from '../components/OCR'
import STT from '../components/STT'
import TTS from '../components/TTS'
import ImageGenerate from '../components/ImageGenerate'
import VideoUnderstand from '../components/VideoUnderstand'

const { Title } = Typography

const TAB_COMPONENTS: Record<string, ComponentType> = {
  llm: Chat,
  orc: OCR,
  stt: STT,
  tts: TTS,
  image_generation: ImageGenerate,
  video_understanding: VideoUnderstand,
}

const TAB_LABELS: Record<string, string> = {
  llm: '语言模型',
  orc: 'OCR',
  tts: 'TTS',
  stt: 'STT',
  image_generation: '图片生成',
  video_understanding: '视频理解',
  embedding: 'Embedding',
  rag: 'RAG',
  text2sql: 'Text2SQL',
  langchain: 'LangChain',
  function_call: 'Function Call',
  mcp: 'MCP',
  a2a: 'A2A',
  agent: 'Agent',
  finetuning: 'Fine-Tuning',
  coze: 'Coze',
  dify: 'Dify',
  knowledge_base: '知识库',
  skills: 'Skills',
}

interface ExperienceCenterProps {
  tab: string
}

export default function ExperienceCenter({ tab }: ExperienceCenterProps) {
  const Component = TAB_COMPONENTS[tab]
  if (Component) {
    return <Component />
  }
  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 8, textAlign: 'center', color: '#999' }}>
      <Title level={4}>{TAB_LABELS[tab] || tab}</Title>
      <p>功能开发中</p>
    </div>
  )
}
