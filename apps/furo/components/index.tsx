
import { classNames } from '../functions'
import { FC } from 'react'

interface ProgressBarProps {
  className?: string
  progress: number | string
}

const ProgressBar: FC<ProgressBarProps> = ({ progress, className }) => {
  return (

    <div className="flex items-center gap-2">
    <div className={'flex flex-grow h-2 rounded-full bg-dark-700 overflow-hidden'}>
        <div
          className="flex justify-end h-full rounded-r-full bg-gradient-to-r from-white to-blue"
          style={{ width: `${Number(progress) * 100}%` }}
        />
      </div>
      {(Number(progress) * 100).toFixed(1)}%
    </div>
  )
}

export default ProgressBar
