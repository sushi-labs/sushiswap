import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import React, { FC } from 'react'

export type BadgeColor = 'gray' | 'blue' | 'pink' | 'red'

export interface BadgeProps {
  color: BadgeColor
  value: number | string
}

export const COLOR = {
  gray: 'bg-dark-700',
  blue: 'bg-blue',
  pink: 'bg-pink',
  red: 'bg-red',
}

const Badge: FC<BadgeProps & React.HTMLAttributes<HTMLDivElement>> = ({ children, color, value }) => {
  return (
    <div className="relative">
      <div
        className={classNames(
          COLOR[color],
          'ring ring-dark-900/40 flex items-center justify-center shadow-md absolute top-[-6px] right-[-6px] h-4 w-4 rounded-full p-1 pointer-events-none'
        )}
      >
        <Typography variant="xxs" component="span" className="text-white">
          {value}
        </Typography>
      </div>
      {children}
    </div>
  )
}

export default Badge
