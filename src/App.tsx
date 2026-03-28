import { useState } from 'react'
import StatusTimeline from './components/StatusTimeline/StatusTimeline'
import ThoughtBubble from './components/ThoughtBubble/ThoughtBubble'
import ChatArea from './components/ChatArea/ChatArea'
import ContextPanel from './components/ContextPanel/ContextPanel'
import Sidebar from './components/Sidebar/Sidebar'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function App() {
  const [showContext, setShowContext] = useState(false)

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      {/* Sidebar - History & Tasks */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-slate-800 border-b border-slate-700 flex items-center px-6">
          <h1 className="text-lg font-semibold">Agent Execution Dashboard</h1>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Thought Bubble + Status Timeline */}
          <div className="w-80 bg-slate-800/50 border-r border-slate-700 overflow-y-auto">
            <ThoughtBubble />
            <StatusTimeline />
          </div>

          {/* Center: Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatArea />
          </div>

          {/* Right: Context Panel - Collapsible */}
          {showContext ? (
            <div className="w-80 bg-slate-800/50 border-l border-slate-700 overflow-y-auto relative">
              <button
                onClick={() => setShowContext(false)}
                className="absolute top-2 right-2 p-1 hover:bg-slate-700 rounded z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <ContextPanel />
            </div>
          ) : (
            <div className="w-12 bg-slate-800/50 border-l border-slate-700 flex items-start justify-center pt-4">
              <button
                onClick={() => setShowContext(true)}
                className="p-2 hover:bg-slate-700 rounded"
                title="显示上下文"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
