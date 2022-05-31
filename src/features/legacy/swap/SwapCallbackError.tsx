import Typography from 'app/components/Typography'
import React, { FC, ReactNode } from 'react'

const SwapCallbackError: FC<{ error: ReactNode }> = ({ error }) => {
  return (
    <div className="flex items-center justify-center gap-2 text-red">
      <Typography variant="sm" weight={700}>
        {error}
      </Typography>
    </div>
  )
}

export default SwapCallbackError
