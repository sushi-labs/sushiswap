import { useAppDispatch } from 'app/state/hooks'
import { setStrategy } from 'app/state/inari/actions'
import { useInariState, useInariStrategies } from 'app/state/inari/hooks'
import React, { FC } from 'react'

import { classNames } from '../../functions'

interface StrategySelectorProps {}

const StrategySelector: FC<StrategySelectorProps> = () => {
  const { id } = useInariState()
  const strategies = useInariStrategies()
  const dispatch = useAppDispatch()

  return (
    <div className="flex flex-col gap-4 z-10 relative">
      {Object.values(strategies)?.map((v) => {
        return (
          <div
            key={v.id}
            onClick={() => dispatch(setStrategy(v.getStrategy()))}
            className={classNames(
              v.id === id ? 'border-gradient-r-blue-pink-dark-800' : 'bg-dark-900',
              'cursor-pointer border border-transparent pl-5 py-2 rounded whitespace-nowrap w-full font-bold h-[48px] flex items-center text-sm'
            )}
          >
            {v.general.name}
          </div>
        )
      })}
    </div>
  )
}

export default StrategySelector
