import { useSelector } from 'react-redux'
import { Brain, Phone, CheckCircle } from 'lucide-react'
import type { RootState } from '../../store/store'
import { StepType } from '../../types'
import clsx from 'clsx'

const stepConfig: Record<string, { icon: typeof Brain; label: string; color: string }> = {
  [StepType.THINKING]: { icon: Brain, label: '思考中', color: 'text-yellow-400' },
  [StepType.CALLING]: { icon: Phone, label: '执行中', color: 'text-blue-400' },
  [StepType.VALIDATING]: { icon: CheckCircle, label: '验证中', color: 'text-green-400' },
}

export default function StatusTimeline() {
  const { steps, isStreaming } = useSelector((state: RootState) => state.step)

  return (
    <div className="p-4">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        执行状态
      </h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-700" />

        {/* Timeline steps */}
        <div className="space-y-4">
          {steps.length === 0 ? (
            <div className="flex items-center gap-3 text-slate-500 pl-8">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <span className="text-sm">等待开始...</span>
            </div>
          ) : (
            steps.map((step, index) => {
              const config = stepConfig[step.stepType]
              const Icon = config.icon
              const isLast = index === steps.length - 1

              return (
                <div key={index} className="relative flex items-start gap-3 pl-8">
                  {/* Icon */}
                  <div
                    className={clsx(
                      'relative z-10 w-8 h-8 rounded-full flex items-center justify-center',
                      step.stepType === StepType.THINKING && 'bg-yellow-500/20',
                      step.stepType === StepType.CALLING && 'bg-blue-500/20',
                      step.stepType === StepType.VALIDATING && 'bg-green-500/20'
                    )}
                  >
                    {step.stepType === StepType.THINKING && (
                      <Icon className={clsx('w-4 h-4 animate-pulse', config.color)} />
                    )}
                    {step.stepType === StepType.CALLING && (
                      <Icon className={clsx('w-4 h-4 animate-spin', config.color)} />
                    )}
                    {step.stepType === StepType.VALIDATING && (
                      <Icon className={clsx('w-4 h-4', config.color)} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className={clsx('text-sm font-medium', config.color)}>
                      {config.label}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                      {step.content}
                    </div>
                  </div>

                  {/* Animated pulse for current step */}
                  {isLast && isStreaming && (
                    <div className="absolute -left-1 top-0 w-10 h-10 rounded-full bg-blue-500/20 animate-ping" />
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
