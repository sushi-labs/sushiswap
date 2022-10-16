import { ComponentType, FC } from 'react'

import { SquareIcon } from './SquareIcon'

interface AcademyIcon {
  color: string
  Icon: ComponentType
}

export const AcademyIcon: FC<AcademyIcon> = ({ color, Icon }) => (
  <div className="w-[130px] h-[130px] relative">
    <SquareIcon fill={color} />
    <div className="absolute bottom-0 right-0 backdrop-blur-md bg-white/[0.1] rounded-2xl">
      <Icon />
    </div>
  </div>
)
