import type { StepStatus } from '../types'

export type SSECallback = (step: StepStatus) => void
export type SSEErrorCallback = (error: Error) => void
export type SSECompleteCallback = () => void

export interface SSEConnection {
  send: (prompt: string) => void
  close: () => void
}

export function createSSEConnection(
  onStep: SSECallback,
  onError?: SSEErrorCallback,
  onComplete?: SSECompleteCallback
): SSEConnection {
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null
  let aborted = false

  return {
    send: async (prompt: string) => {
      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const decoder = new TextDecoder()
        const bodyReader = response.body?.getReader()
        if (!bodyReader) {
          throw new Error('Response body is null')
        }
        reader = bodyReader

        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()

          if (done || aborted) {
            break
          }

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data:')) {
              try {
                const data = line.slice(5).trim()
                if (data) {
                  const step: StepStatus = JSON.parse(data)
                  onStep(step)
                }
              } catch (e) {
                console.warn('Failed to parse SSE data:', e)
              }
            }
          }
        }

        onComplete?.()
      } catch (error) {
        onError?.(error instanceof Error ? error : new Error(String(error)))
      }
    },
    close: () => {
      aborted = true
      reader?.cancel()
      reader = null
    },
  }
}

// Helper to parse SSE stream from EventSource alternative using fetch
export async function parseSSEConnection(
  prompt: string,
  onStep: SSECallback,
  onError?: SSEErrorCallback,
  onComplete?: SSECompleteCallback
): Promise<void> {
  const connection = createSSEConnection(onStep, onError, onComplete)
  connection.send(prompt)
}
