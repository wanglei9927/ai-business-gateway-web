import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import clsx from 'clsx'

interface ResultCardProps {
  type: 'success' | 'error' | 'warning'
  title: string
  message: string
  details?: string[]
  onConfirm?: () => void
  onCancel?: () => void
}

export default function ResultCard({
  type,
  title,
  message,
  details,
  onConfirm,
  onCancel,
}: ResultCardProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
  }

  const colors = {
    success: 'bg-green-500/20 border-green-500/30 text-green-400',
    error: 'bg-red-500/20 border-red-500/30 text-red-400',
    warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
  }

  const Icon = icons[type]

  return (
    <div className={clsx('rounded-xl border p-4', colors[type])}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm mt-1 opacity-80">{message}</p>

          {details && details.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm">
              {details.map((detail, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                  {detail}
                </li>
              ))}
            </ul>
          )}

          {(onConfirm || onCancel) && (
            <div className="flex gap-3 mt-4">
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-lg border border-current/30 hover:bg-white/10 transition-colors text-sm"
                >
                  取消
                </button>
              )}
              {onConfirm && (
                <button
                  onClick={onConfirm}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-sm font-medium',
                    type === 'success' && 'bg-green-600 hover:bg-green-700',
                    type === 'error' && 'bg-red-600 hover:bg-red-700',
                    type === 'warning' && 'bg-yellow-600 hover:bg-yellow-700'
                  )}
                >
                  确认
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
