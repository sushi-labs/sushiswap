import { VerticalStepper } from './vertical'

export type Stepper = {
  Vertical: typeof VerticalStepper
}

export const Stepper: Stepper = { Vertical: VerticalStepper }
