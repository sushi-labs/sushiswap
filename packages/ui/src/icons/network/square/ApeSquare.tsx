import { ApeNaked } from '../naked/ApeNaked'

import type { IconComponent } from '../../../types'

export const ApeSquare: IconComponent = (props) => (
  <ApeNaked {...props} circle={<rect width="30" height="30" fill="#fff" />} />
)
