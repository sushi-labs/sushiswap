import { useDerivedInariState } from 'app/state/inari/hooks'
import React, { FC } from 'react'

import Typography from '../../components/Typography'

interface InariHeaderProps {}

const InariDescription: FC<InariHeaderProps> = () => {
  const { general } = useDerivedInariState()

  return (
    <div className="grid gap-2">
      <Typography variant="lg" className="text-high-emphesis" weight={700}>
        {general?.name}
      </Typography>
      <Typography>{general?.description}</Typography>
    </div>
  )
}

export default InariDescription
