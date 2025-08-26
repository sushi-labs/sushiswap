import { useMemo } from 'react'
import type { LPTabValueType } from '../manage-dialog'
import { V2Manage } from './v2-manage'
import { V2PositionDetail } from './v2-position-detail'

export const V2Content = ({
  currentTab,
  position,
}: { currentTab: LPTabValueType; position: any }) => {
  const content = useMemo(() => {
    switch (currentTab) {
      case 'detail':
        return <V2PositionDetail position={position} />
      case 'manage':
        return <V2Manage position={position} />
      case 'migrate':
        return <div>Migrate Content for V2</div>
    }
  }, [currentTab, position])

  return <div>{content}</div>
}
