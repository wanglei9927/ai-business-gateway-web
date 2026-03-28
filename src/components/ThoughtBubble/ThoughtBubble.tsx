import { useSelector } from 'react-redux'
import { ChevronDown, ChevronUp, MessageSquare, BookOpen, Search, Sparkles, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import type { RootState } from '../../store/store'
import { StepType } from '../../types'

// Step type configurations
const STEP_CONFIG = {
  [StepType.THINKING]: {
    icon: Sparkles,
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/20',
    label: '思考中',
  },
  [StepType.CALLING]: {
    icon: CheckCircle,
    color: 'text-blue-400',
    bgColor: 'bg-blue-900/20',
    label: '调用工具',
  },
  [StepType.VALIDATING]: {
    icon: CheckCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-900/20',
    label: '数据验证',
  },
  [StepType.RETRIEVING]: {
    icon: BookOpen,
    color: 'text-amber-400',
    bgColor: 'bg-amber-900/20',
    label: '检索知识库',
  },
  [StepType.SEARCHING]: {
    icon: Search,
    color: 'text-orange-400',
    bgColor: 'bg-orange-900/20',
    label: '搜索匹配',
  },
  [StepType.RESPONDING]: {
    icon: MessageSquare,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-900/20',
    label: '生成回答',
  },
}

export default function ThoughtBubble() {
  const [isExpanded, setIsExpanded] = useState(true)
  const { steps, isStreaming } = useSelector((state: RootState) => state.step)

  // Get current step info
  const currentStep = steps[steps.length - 1]
  const currentConfig = currentStep ? STEP_CONFIG[currentStep.stepType as keyof typeof STEP_CONFIG] : null

  // Group steps by type for cleaner display
  const groupedSteps = steps.reduce((acc, step) => {
    const type = step.stepType
    if (!acc[type]) {
      acc[type] = []
    }
    acc[type].push(step)
    return acc
  }, {} as Record<string, typeof steps>)

  // Get the most recent step of each type for display
  const latestByType = Object.entries(groupedSteps).reduce((acc, [type, typeSteps]) => {
    acc[type] = typeSteps[typeSteps.length - 1]
    return acc
  }, {} as Record<string, typeof steps[0]>)

  if (steps.length === 0 && !isStreaming) {
    return null
  }

  return (
    <div className="p-4 border-t border-slate-700">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 w-full"
      >
        <MessageSquare className="w-4 h-4" />
        <span>AI 处理过程</span>
        {isExpanded ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
      </button>

      {/* Current step indicator */}
      {currentStep && !isExpanded && (
        <div className="mt-2 flex items-center gap-2">
          {currentConfig && (
            <>
              <currentConfig.icon className={`w-4 h-4 ${currentConfig.color}`} />
              <span className={`text-xs ${currentConfig.color}`}>
                {currentStep.content}
              </span>
            </>
          )}
        </div>
      )}

      {isExpanded && (
        <div className="mt-3 p-3 bg-slate-800/50 rounded-lg space-y-3">
          {/* Show latest step of each type */}
          {Object.entries(latestByType).map(([type, step]) => {
            const config = STEP_CONFIG[type as keyof typeof STEP_CONFIG]
            if (!config) return null
            return (
              <div
                key={type}
                className={`flex items-start gap-2 p-2 rounded ${config.bgColor}`}
              >
                <config.icon className={`w-4 h-4 ${config.color} mt-0.5`} />
                <div className="flex-1">
                  <div className={`text-xs font-medium ${config.color}`}>
                    {config.label}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {step.content}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Show full history if there are multiple steps */}
          {steps.length > Object.keys(latestByType).length && (
            <div className="border-t border-slate-700 pt-3 mt-3">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                完整历史
              </div>
              <div className="space-y-1">
                {steps.map((step, index) => {
                  const config = STEP_CONFIG[step.stepType as keyof typeof STEP_CONFIG]
                  if (!config) return null
                  return (
                    <div key={index} className="flex items-center gap-2 text-xs text-slate-500 pl-2 border-l border-slate-700">
                      <config.icon className={`w-3 h-3 ${config.color}`} />
                      <span>{step.content}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
