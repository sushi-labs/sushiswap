import { PlusCircleIcon } from '@heroicons/react/24/solid'
import { Button, ButtonProps, classNames } from '@sushiswap/ui'
import React, { ElementType, forwardRef, Ref } from 'react'

export const ViewAllButton = forwardRef(
  ({ isSmall, className, ...rest }: ButtonProps<ElementType>, ref: Ref<HTMLButtonElement>) => (
    <Button
      ref={ref}
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
)
