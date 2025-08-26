import { useMemo } from 'react'
import type { LPTabValueType } from '../manage-dialog'

export const V2Content = ({
  currentTab,
}: // position,
{
  currentTab: LPTabValueType // position: any
}) => {
  const content = useMemo(() => {
    switch (currentTab) {
      case 'detail':
        return <div>Detail Content for V2</div>
      case 'manage':
        return <div>Manage Content for V2</div>
      case 'migrate':
        return <div>Migrate Content for V2</div>
    }
  }, [currentTab])

  return <div>{content}</div>
}
