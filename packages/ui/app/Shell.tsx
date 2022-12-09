import { useIsMounted } from '@sushiswap/hooks'
import { useMemo } from 'react'

export interface ShellProps {
  children?: React.ReactNode
}

export function Shell({ children }: ShellProps): JSX.Element {
  const isMounted = useIsMounted()

  const snowFlakes = useMemo(() => {
    if (isMounted)
      return Array.from(Array(50)).map((el, idx) => {
        const size = random(1, 4) * 0.06

        return (
          <div
            className="bg-white rounded-full absolute top-[-5vh]"
            key={idx}
            style={{
              width: `${size}vw`,
              height: `${size}vw`,
              opacity: `${random(10, 40)}%`,
              // '--left-ini': `${random(1, 20) - 10}vw`,
              // '--left-end': `${random(1, 20) - 10}vw`,
              left: `${random(1, 100)}vw`,
              animation: `snowfall ${5 + random(1, 30)}s linear infinite`,
              animationDelay: `-${random(1, 10)}s`,
            }}
          />
        )
      })

    return undefined
  }, [isMounted])

  return (
    <div>
      <div className="fixed inset-0 pointer-events-none">{snowFlakes}</div>
      {children}
    </div>
  )
}
