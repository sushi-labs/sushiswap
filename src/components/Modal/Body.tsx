import { classNames } from 'app/functions'
import React, { FC } from 'react'

export interface ModalBodyProps {
  className?: string
}

const ModalBody: FC<ModalBodyProps> = ({ className = '', children }) => {
  return <div className={classNames('flex flex-col h-full lg:max-w-lg lg:min-w-lg gap-4', className)}>{children}</div>
}

export default ModalBody
