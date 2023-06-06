import classNames from 'classnames'
import { FC } from 'react'

export enum ProgressColor {
  PINK,
  BLUE,
  GRADIENT,
  GREEN,
  GRAY,
  WHITE,
}

interface ProgressBarProps {
  progress: number | string
  color: ProgressColor
  className?: string
  showLabel?: boolean
}

export const ProgressBar: FC<ProgressBarProps> = ({ progress, color, showLabel = true, className }) => {
  let fromColor
  let toColor
  if (color === ProgressColor.BLUE) {
    fromColor = 'from-blue'
    toColor = 'to-blue'
  } else if (color === ProgressColor.PINK) {
    fromColor = 'from-pink'
    toColor = 'to-pink'
  } else if (color === ProgressColor.GRADIENT) {
    fromColor = 'from-blue'
    toColor = 'to-pink'
  } else if (color === ProgressColor.GREEN) {
    fromColor = 'from-green'
    toColor = 'to-green'
  } else if (color === ProgressColor.GRAY) {
    fromColor = 'from-gray-600 dark:from-slate-400'
    toColor = 'to-gray-600 dark:to-slate-400'
  } else if (color === ProgressColor.WHITE) {
    fromColor = 'from-white dark:from-white'
    toColor = 'to-white dark:to-white'
  }

  return (
    <div className="flex w-full items-center gap-2">
      <div
        className={classNames(
          'relative flex flex-grow h-4 rounded-full bg-gradient-to-r overflow-hidden bg-[rgba(0,0,0,0.24)] dark:bg-[rgba(255,255,255,0.12)]',
          className
        )}
      >
        <div
          className={`flex justify-end h-full rounded-r-full bg-gradient-to-r ${fromColor} ${toColor}`}
          style={{ width: `${Number(progress) * 100}%` }}
        />
        <div className="absolute inset-0 flex justify-center items-center">
          <span className="text-xs font-semibold text-white">
            {showLabel ? `${(Number(progress) * 100).toFixed(1)}%` : ''}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
