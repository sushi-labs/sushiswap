import type { IconComponent } from '../../../types'
import { HyperEVMNaked } from '../naked'

export const HyperEVMSquare: IconComponent = (props) => (
  <HyperEVMNaked
    {...props}
    circle={<rect width="144" height="144" fill="#102623" />}
  />
)
