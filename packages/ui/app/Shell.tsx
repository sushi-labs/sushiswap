export interface ShellProps {
  children?: React.ReactNode
}

const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function Shell({ children }: ShellProps): JSX.Element {
  return (
    <div>
      <div className="fixed inset-0 pointer-events-none">
        {Array.from(Array(50)).map((el, idx) => {
          const size = random(1, 5) * 0.06

          return (
            <div
              className="bg-white rounded-full absolute top-[-5vh]"
              key={idx}
              style={{
                width: `${size}vw`,
                height: `${size}vw`,
                opacity: `${random(50, 100)}%`,
                // '--left-ini': `${random(1, 20) - 10}vw`,
                // '--left-end': `${random(1, 20) - 10}vw`,
                left: `${random(1, 100)}vw`,
                animation: `snowfall ${5 + random(1, 30)}s linear infinite`,
                animationDelay: `-${random(1, 10)}s`,
              }}
            />
          )
        })}
      </div>
      {children}
    </div>
  )
}
