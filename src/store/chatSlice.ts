import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ChatMessage, Session } from '../types'

interface ChatState {
  sessions: Session[]
  currentSessionId: string | null
  messages: ChatMessage[]
  isLoading: boolean
}

const initialState: ChatState = {
  sessions: [],
  currentSessionId: null,
  messages: [],
  isLoading: false,
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload)
    },
    updateLastMessage: (state, action: PayloadAction<Partial<ChatMessage>>) => {
      if (state.messages.length > 0) {
        const lastMessage = state.messages[state.messages.length - 1]
        state.messages[state.messages.length - 1] = {
          ...lastMessage,
          ...action.payload,
        }
      }
    },
    clearMessages: (state) => {
      state.messages = []
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    createSession: (state, action: PayloadAction<Session>) => {
      state.sessions.unshift(action.payload)
      state.currentSessionId = action.payload.id
      state.messages = []
    },
    selectSession: (state, action: PayloadAction<string>) => {
      state.currentSessionId = action.payload
      const session = state.sessions.find(s => s.id === action.payload)
      if (session) {
        state.messages = session.messages
      }
    },
  },
})

export const { addMessage, updateLastMessage, clearMessages, setLoading, createSession, selectSession } = chatSlice.actions

export default chatSlice.reducer
