import * as React from 'react'

import type { NakedNetworkIconComponent } from '../../../types'
import { MantaNaked } from '../naked/manta-naked'

export const MantaCircle: NakedNetworkIconComponent = (props) => (
  <MantaNaked {...props} />
)
