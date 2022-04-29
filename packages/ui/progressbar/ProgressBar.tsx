import { FC } from 'react'
import classNames from 'classnames'

export enum ProgressColor {
  PINK,
  BLUE,
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
    fromColor = 'from-blue-200'
    toColor = 'to-blue'
  } else if (color === ProgressColor.PINK) {
    fromColor = 'from-pink-200'
    toColor = 'to-pink'
  }
  return (
    <div className="flex items-center gap-2">
      <div className={classNames('flex flex-grow h-2 rounded-full bg-dark-700 overflow-hidden', className)}>
        <div
          className={`shadow-depth-1 flex justify-end h-full rounded-r-full bg-gradient-to-r ${fromColor} ${toColor}`}
          style={{ width: `${Number(progress) * 100}%` }}
        />
      </div>
      {showLabel ? `${(Number(progress) * 100).toFixed(1)}%` : ''}
    </div>
  )
}

export default ProgressBar
