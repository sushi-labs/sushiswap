import { useMemo } from 'react'
import type { LPTabValueType } from '../manage-dialog'
import { V3Manage } from './v3-manage'
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
        return <V3Manage position={position} />
    }
  }, [currentTab, position])

  return <div>{content}</div>
}
