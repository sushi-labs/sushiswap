import { classNames, Typography } from '@sushiswap/ui'
import { useInView } from 'framer-motion'
import { FC, ReactNode, useRef } from 'react'

export const AnimatedTitle: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <Typography
      variant="hero"
      weight={600}
      className={classNames(className, 'max-w-[740px]')}
      ref={ref}
      style={{
        transform: isInView ? 'none' : 'translateX(-100px)',
        opacity: isInView ? 1 : 0,
        transition: 'all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s',
      }}
    >
      {children}
    </Typography>
  )
}
