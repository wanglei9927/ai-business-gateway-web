// Step types from backend
export enum StepType {
  THINKING = 'THINKING',
  CALLING = 'CALLING',
  VALIDATING = 'VALIDATING',
  RETRIEVING = 'RETRIEVING',
  SEARCHING = 'SEARCHING',
  RESPONDING = 'RESPONDING',
}

// Step status from SSE stream
export interface StepStatus {
  stepType: StepType
  content: string
  metadata: Record<string, unknown> | null
}

// Chat message
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  steps?: StepStatus[]
}

// Card types for dynamic rendering
export type CardType = 'ORDER_SUMMARY' | 'DATA_CHART' | 'PERMISSION_DENIED' | 'CONFIRMATION'

// Order summary card data
export interface OrderSummaryData {
  orderId?: string
  productId: string
  count: number
  totalPrice: number
  status: string
}

// Data chart card data
export interface DataChartData {
  title: string
  type: 'line' | 'bar' | 'pie'
  data: unknown[]
}

// Confirmation card data
export interface ConfirmationData {
  title: string
  message: string
  confirmText: string
  cancelText: string
  onConfirm: () => void
  onCancel: () => void
}

// Permission denied card data
export interface PermissionDeniedData {
  action: string
  requiredPermission: string
}

// Generic card data
export interface CardData {
  type: CardType
  data: OrderSummaryData | DataChartData | ConfirmationData | PermissionDeniedData | null
}

// Session/Conversation
export interface Session {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

// SSE connection state
export interface SSEState {
  isConnected: boolean
  isStreaming: boolean
  currentStep: StepStatus | null
  steps: StepStatus[]
  error: string | null
}
