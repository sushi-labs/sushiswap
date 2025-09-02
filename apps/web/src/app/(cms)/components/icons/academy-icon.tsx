import type { ComponentType, FC } from 'react'

import { SquareIcon } from './square-icon'

interface AcademyIcon {
  color: string
  Icon: ComponentType<React.ComponentProps<'svg'>>
}

export const AcademyIcon: FC<AcademyIcon> = ({ color, Icon }) => (
  <div className="w-20 h-20 sm:w-[130px] sm:h-[130px] relative">
    <SquareIcon fill={color} className="w-14 h-14 sm:w-[92px] sm:h-[92px]" />
    <div className="absolute bottom-0 right-0 backdrop-blur bg-white/[0.1] rounded-xl">
      <Icon className="w-16 sm:w-[102px] h-fit" />
    </div>
  </div>
)
