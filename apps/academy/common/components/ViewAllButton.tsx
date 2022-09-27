import { PlusCircleIcon } from '@heroicons/react/24/solid'
import { Button, ButtonProps, classNames } from '@sushiswap/ui'
import React, { ElementType, FC } from 'react'

export const ViewAllButton: FC<ButtonProps<ElementType>> = ({ isSmall, className, ...rest }) => (
  <Button
    color="gray"
    className={classNames(
      'font-normal !bg-slate-800 rounded-full',
      isSmall ? 'h-8 pr-1 sm:hidden' : 'pr-2.5 pl-[18px] hidden sm:flex',
      className
    )}
    endIcon={<PlusCircleIcon fill="#3B7EF6" height={24} width={24} />}
    {...rest}
  >
    View All
  </Button>
)
