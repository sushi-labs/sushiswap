import { FC, ReactNode } from 'react'
import { animated, useSpring } from 'react-spring'
import useResizeObserver from 'use-resize-observer'

interface Collapsible {
  open: boolean
  children: ReactNode
  className?: string
}

export const Collapsible: FC<Collapsible> = ({ className, open, children }) => {
  const { ref, height } = useResizeObserver()

  const props = useSpring({
    height: open ? height ?? 0 : 0,
    config: {
      mass: 1.2,
      tension: 300,
      friction: 20,
      clamp: true,
      velocity: 0.01,
    },
  })

  return (
    <animated.div
      style={{
        ...props,
        overflow: 'hidden',
        width: '100%',
        willChange: 'height',
      }}
    >
      <div ref={ref} className={className}>
        {children}
      </div>
    </animated.div>
  )
}
