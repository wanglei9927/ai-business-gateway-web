import { useSelector } from 'react-redux'
import { Code, FileJson, Clock } from 'lucide-react'
import type { RootState } from '../../store/store'

export default function ContextPanel() {
  const { steps, currentStep } = useSelector((state: RootState) => state.step)

  // Get the last few steps as context
  const recentSteps = steps.slice(-5)

  return (
    <div className="p-4">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        上下文
      </h2>

      {/* Current Step Metadata */}
      {currentStep?.metadata && (
        <div className="mb-4">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">
            当前数据
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <FileJson className="w-3 h-3" />
              <span>Metadata</span>
            </div>
            <pre className="text-xs text-slate-300 overflow-x-auto">
              {JSON.stringify(currentStep.metadata, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Recent Steps */}
      <div className="mb-4">
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">
          最近步骤
        </div>
        <div className="space-y-2">
          {recentSteps.map((step, index) => (
            <div
              key={index}
              className="bg-slate-800/50 rounded-lg p-3 text-xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-slate-300">{step.stepType}</span>
                <Clock className="w-3 h-3 text-slate-500" />
              </div>
              <div className="text-slate-400 line-clamp-2">{step.content}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Raw JSON View */}
      <div>
        <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">
          原始数据
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Code className="w-3 h-3" />
            <span>Steps JSON</span>
          </div>
          <pre className="text-xs text-slate-300 overflow-x-auto max-h-48">
            {JSON.stringify(steps, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
