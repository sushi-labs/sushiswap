import { useIsMounted } from '@sushiswap/hooks'
import { FC, ReactElement } from 'react'

interface MountedController {
  children: ReactElement
  skeleton: ReactElement

  // For creating skeleton layouts more easily
  showSkeleton?: boolean
}

export const MountedController: FC<MountedController> = ({ children, skeleton, showSkeleton = false }) => {
  const isMounted = useIsMounted()

  if (!isMounted || showSkeleton) return skeleton
  return children
}
