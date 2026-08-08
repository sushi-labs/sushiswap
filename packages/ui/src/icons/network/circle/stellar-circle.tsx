import { StellarNaked } from '../naked/stellar-naked'

import type { IconComponent } from '../../../types'

export const StellarCircle: IconComponent = (props) => (
  <StellarNaked
    {...props}
    circle={<rect width={128} height={128} rx={64} fill="#FDDA24" />}
  />
)
