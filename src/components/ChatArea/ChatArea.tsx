import { useSelector } from 'react-redux'
import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Send, Loader2 } from 'lucide-react'
import type { RootState } from '../../store/store'
import { parseSSEConnection } from '../../services/sseService'
import { useDispatch } from 'react-redux'
import { addMessage } from '../../store/chatSlice'
import { startStreaming, addStep, stopStreaming } from '../../store/stepSlice'
import { StepType } from '../../types'
import type { ChatMessage } from '../../types'

export default function ChatArea() {
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()
  const { messages } = useSelector((state: RootState) => state.chat)
  const steps = useSelector((state: RootState) => state.step.steps)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    }
    dispatch(addMessage(userMessage))
    setInput('')
    setIsStreaming(true)
    dispatch(startStreaming())

    // Add user message to steps
    dispatch(addStep({
      stepType: StepType.THINKING,
      content: '正在发送请求...',
      metadata: null,
    }))

    try {
      await parseSSEConnection(
        input,
        (step) => {
          dispatch(addStep(step))
        },
        (error) => {
          console.error('SSE Error:', error)
          setIsStreaming(false)
          dispatch(stopStreaming())
        },
        () => {
          setIsStreaming(false)
          dispatch(stopStreaming())

          // Add assistant response message
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: '处理完成',
            timestamp: Date.now(),
            steps: [...steps],
          }
          dispatch(addMessage(assistantMessage))
        }
      )
    } catch (error) {
      console.error('Request failed:', error)
      setIsStreaming(false)
      dispatch(stopStreaming())
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <Send className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium">开始对话</p>
            <p className="text-sm mt-2">输入您的问题，AI 将为您执行任务</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-100'
              }`}
            >
              {message.role === 'assistant' ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          </div>
        ))}

        {isStreaming && steps.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-slate-700 rounded-2xl px-4 py-3 max-w-[70%]">
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">AI 正在处理...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-700 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入您的问题..."
            disabled={isStreaming}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl px-6 py-3 flex items-center gap-2 transition-colors"
          >
            {isStreaming ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span>发送</span>
          </button>
        </form>
      </div>
    </div>
  )
}
