import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MessageSquare, Plus, Clock, ChevronRight, Trash2 } from 'lucide-react'
import { createSession, selectSession, clearMessages } from '../../store/chatSlice'
import type { RootState } from '../../store/store'
import type { Session } from '../../types'

export default function Sidebar() {
  const dispatch = useDispatch()
  const { sessions } = useSelector((state: RootState) => state.chat)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleNewChat = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      title: '新对话',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    dispatch(createSession(newSession))
  }

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>新对话</span>
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="text-xs text-slate-500 uppercase tracking-wider px-2 py-2">
          历史对话
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">暂无历史对话</p>
          </div>
        ) : (
          <div className="space-y-1">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => dispatch(selectSession(session.id))}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 text-left transition-colors group"
              >
                <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{session.title}</div>
                  <div className="text-xs text-slate-500">
                    {new Date(session.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 space-y-2">
        {showClearConfirm ? (
          <div className="flex gap-2">
            <button
              onClick={() => {
                dispatch(clearMessages())
                setShowClearConfirm(false)
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 text-sm"
            >
              确认清空
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-2 text-sm"
            >
              取消
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-slate-300 rounded-lg py-2 text-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>清空历史对话</span>
          </button>
        )}
        <div className="text-xs text-slate-500 text-center">
          AI Business Gateway
        </div>
      </div>
    </div>
  )
}
