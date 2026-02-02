/**
 * 业务 API 接口
 */

import { streamRequest, type StreamChunk } from '../utils/streamChat'

export interface ChatOptions {
  onChunk?: (chunk: StreamChunk) => void
  onError?: (error: Error) => void
  model?: string
  temperature?: number
  num_predict?: number
}

/**
 * 聊天接口
 */
export async function chat(prompt: string, opts: ChatOptions = {}): Promise<void> {
  const {
    onChunk,
    onError,
    model = 'my-deepseek-r1-1.5',
    temperature = 0.45,
    num_predict = 384,
  } = opts

  await streamRequest(
    '/ai/ollama/chat',
    {
      prompt,
      model,
      stream: true,
      options: { temperature, num_predict },
    },
    { onChunk, onError }
  )
}
