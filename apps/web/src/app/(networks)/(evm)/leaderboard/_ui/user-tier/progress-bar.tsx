import { useEffect, useState } from 'react'

export const ProgressBar = ({
  current,
  target,
  durationMs = 800,
}: { current: number; target: number; durationMs?: number }) => {
  const endWidth = Math.min((current / target) * 100, 100)

  const [width, setWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setWidth(endWidth), 250)
    return () => clearTimeout(t)
  }, [endWidth])

  return (
    <div className="w-full rounded-full h-3 dark:bg-secondary bg-secondary overflow-hidden">
      <div
        style={{
          width: `${width}%`,
          transition: `width ${durationMs}ms ease`,
        }}
        // className="h-3 rounded-full  bg-gradient-to-br from-[#F1E363] to-[#EA6D33]"
        className="h-3 rounded-full bg-blue"
      />
    </div>
  )
}
