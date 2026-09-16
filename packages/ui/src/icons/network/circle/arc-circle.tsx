import type { IconComponent } from '../../../types'
import { ArcNaked } from '../naked/arc-naked'

export const ArcCircle: IconComponent = (props) => (
  <ArcNaked
    {...props}
    circle={
      <rect
        width={128}
        height={128}
        rx={64}
        className="fill-white dark:fill-black"
      />
    }
  />
)
