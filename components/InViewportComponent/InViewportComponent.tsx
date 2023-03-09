import { useInViewport } from '@sushiswap/hooks'
import { FC, ReactNode, useRef } from 'react'

interface InViewportComponent {
  children: ReactNode
}

export const InViewportComponent: FC<InViewportComponent> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inViewport = useInViewport(ref)

  return (
    <div
      ref={ref}
      style={{
        minHeight: inViewport ? 420 : 0,
      }}
    >
      {inViewport ? children : null}
    </div>
  )
}
