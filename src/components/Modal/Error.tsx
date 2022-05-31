import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import React, { FC } from 'react'

export interface ModalActionErrorProps {
  className?: string
}

const ModalError: FC<ModalActionErrorProps> = ({ className = '', children }) => {
  if (!children) return <></>

  return (
    <Typography variant="xs" weight={700} className={classNames('text-center text-red', className)}>
      {children}
    </Typography>
  )
}

export default ModalError
