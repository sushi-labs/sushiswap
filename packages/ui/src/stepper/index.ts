import { VerticalStepper } from './vertical'

export type Stepper = {
  Vertical: typeof VerticalStepper
}

/**
 * @deprecated
 */
export const Stepper: Stepper = { Vertical: VerticalStepper }
