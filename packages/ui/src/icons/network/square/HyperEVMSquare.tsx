import type { IconComponent } from '../../../types'
import { HyperEVMNaked } from '../naked'

export const HyperEVMSquare: IconComponent = (props) => (
  <HyperEVMNaked
    {...props}
    circle={<rect width="128" height="128" fill="#102623" />}
  />
)
