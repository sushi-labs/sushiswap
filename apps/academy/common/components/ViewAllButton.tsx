import { PlusCircleIcon } from '@heroicons/react/24/solid'
import { classNames } from '@sushiswap/ui'
import React, { ElementType, forwardRef, Ref } from 'react'
import { Button, ButtonProps } from '@sushiswap/ui/future/components/button'

export const ViewAllButton = forwardRef(
  ({ isSmall, className, ...rest }: ButtonProps<ElementType>, ref: Ref<HTMLButtonElement>) => (
    <Button
      ref={ref}
      color="default"
      className={classNames(isSmall ? 'sm:hidden' : 'hidden sm:flex', className)}
      endIcon={<PlusCircleIcon fill="#3B7EF6" height={24} width={24} />}
      {...rest}
    >
      View All
    </Button>
  )
)
