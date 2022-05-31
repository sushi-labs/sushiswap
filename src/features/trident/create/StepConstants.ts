import { CreatePoolStep } from 'app/features/trident/create/createSlice'

export const activeStepColor = 'bg-blue'
export const stepAheadColor = 'bg-dark-700'

export interface StepProps {
  stepNum: CreatePoolStep
  title: string
  currentStep: CreatePoolStep
  stepSetter(x: CreatePoolStep): void
  isLastStep?: boolean
}

export const stepTitleText: Record<CreatePoolStep, string> = {
  1: 'Select pool type',
  2: 'Select assets & deposit',
}
