import { ArrowRightIcon } from '@heroicons/react/solid'
import { useDerivedInariState } from 'app/state/inari/hooks'
import React, { FC } from 'react'

import Typography from '../../components/Typography'

interface StrategyStepDisplayProps {}

const StrategyStepDisplay: FC<StrategyStepDisplayProps> = () => {
  const { general } = useDerivedInariState()

  return (
    <div className="flex gap-3 items-center text-high-emphesis">
      {general?.steps
        .map<React.ReactNode>((el) => (
          <Typography weight={700} variant="lg" key={el}>
            {el}
          </Typography>
        ))
        .reduce(
          (acc, x) =>
            acc === null ? (
              x
            ) : (
              <>
                {acc}{' '}
                <div className="rounded-full p-1 bg-dark-800 border-[3px] border-dark-900 relative z-10">
                  <ArrowRightIcon width={16} height={16} />
                </div>{' '}
                {x}
              </>
            ),
          null
        )}
    </div>
  )
}

export default StrategyStepDisplay
