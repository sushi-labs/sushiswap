import { useMemo } from 'react'
import type { LPTabValueType } from '../manage-dialog'
import { V3PositionDetail } from './v3-position-detail'

export const V3Content = ({
  currentTab,
  position,
}: { currentTab: LPTabValueType; position: any }) => {
  const content = useMemo(() => {
    switch (currentTab) {
      case 'detail':
        return <V3PositionDetail position={position} />
      case 'manage':
        return <div>Manage Content for V3</div>
    }
  }, [currentTab, position])

  return <div>{content}</div>
}
