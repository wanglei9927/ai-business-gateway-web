import { configureStore } from '@reduxjs/toolkit'
import stepReducer from './stepSlice'
import chatReducer from './chatSlice'

export const store = configureStore({
  reducer: {
    step: stepReducer,
    chat: chatReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
