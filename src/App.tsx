import { useState } from 'react'
import StatusTimeline from './components/StatusTimeline/StatusTimeline'
import ThoughtBubble from './components/ThoughtBubble/ThoughtBubble'
import ChatArea from './components/ChatArea/ChatArea'
import ContextPanel from './components/ContextPanel/ContextPanel'
import Sidebar from './components/Sidebar/Sidebar'

function App() {
  const [isConnected] = useState(false)

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      {/* Sidebar - History & Tasks */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-slate-800 border-b border-slate-700 flex items-center px-6">
          <h1 className="text-lg font-semibold">Agent Execution Dashboard</h1>
          <div className="ml-auto flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm text-slate-400">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Status Timeline + Thought Bubble */}
          <div className="w-80 bg-slate-800/50 border-r border-slate-700 overflow-y-auto">
            <StatusTimeline />
            <ThoughtBubble />
          </div>

          {/* Center: Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatArea />
          </div>

          {/* Right: Context Panel */}
          <div className="w-80 bg-slate-800/50 border-l border-slate-700 overflow-y-auto">
            <ContextPanel />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
