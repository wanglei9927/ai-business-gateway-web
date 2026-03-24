import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { StepStatus } from '../types'

interface StepState {
  currentStep: StepStatus | null
  steps: StepStatus[]
  isStreaming: boolean
}

const initialState: StepState = {
  currentStep: null,
  steps: [],
  isStreaming: false,
}

export const stepSlice = createSlice({
  name: 'step',
  initialState,
  reducers: {
    startStreaming: (state) => {
      state.isStreaming = true
      state.steps = []
      state.currentStep = null
    },
    stopStreaming: (state) => {
      state.isStreaming = false
    },
    addStep: (state, action: PayloadAction<StepStatus>) => {
      state.currentStep = action.payload
      state.steps.push(action.payload)
    },
    updateLastStep: (state, action: PayloadAction<Partial<StepStatus>>) => {
      if (state.steps.length > 0) {
        const lastStep = state.steps[state.steps.length - 1]
        state.steps[state.steps.length - 1] = {
          ...lastStep,
          ...action.payload,
        }
        state.currentStep = state.steps[state.steps.length - 1]
      }
    },
    clearSteps: (state) => {
      state.steps = []
      state.currentStep = null
      state.isStreaming = false
    },
  },
})

export const { startStreaming, stopStreaming, addStep, updateLastStep, clearSteps } = stepSlice.actions

export default stepSlice.reducer
