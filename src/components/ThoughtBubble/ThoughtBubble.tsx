import { useSelector } from 'react-redux'
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import type { RootState } from '../../store/store'

export default function ThoughtBubble() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { steps, isStreaming } = useSelector((state: RootState) => state.step)

  // Get thinking content from steps
  const thinkingSteps = steps.filter(s => s.stepType === 'THINKING')
  const currentThought = thinkingSteps[thinkingSteps.length - 1]?.content || ''

  if (!currentThought && !isStreaming) {
    return null
  }

  return (
    <div className="p-4 border-t border-slate-700">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 w-full"
      >
        <MessageSquare className="w-4 h-4" />
        <span>AI 思考过程</span>
        {isExpanded ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
      </button>

      {isExpanded && (
        <div className="mt-3 p-3 bg-slate-800/50 rounded-lg">
          <div className="text-xs text-slate-500 italic">
            {currentThought || '正在思考...'}
          </div>

          {/* Show all thinking steps */}
          {thinkingSteps.length > 1 && (
            <div className="mt-3 space-y-2 border-t border-slate-700 pt-3">
              <div className="text-xs text-slate-500 uppercase tracking-wider">
                思考历史
              </div>
              {thinkingSteps.slice(0, -1).map((step, index) => (
                <div key={index} className="text-xs text-slate-600 pl-2 border-l border-slate-700">
                  {step.content}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Collapsed view */}
      {!isExpanded && currentThought && (
        <div className="mt-2 text-xs text-slate-500 italic truncate">
          {currentThought}
        </div>
      )}
    </div>
  )
}
