import { classNames } from '@sushiswap/ui'
import { useInView } from 'framer-motion'
import { type FC, type ReactNode, useRef } from 'react'

export const AnimatedTitle: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <p
      className={classNames(className, 'text-5xl font-semibold max-w-[740px]')}
      ref={ref}
      style={{
        transform: isInView ? 'none' : 'translateX(-100px)',
        opacity: isInView ? 1 : 0,
        transition: 'all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s',
      }}
    >
      {children}
    </p>
  )
}
