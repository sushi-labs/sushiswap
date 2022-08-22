import { Transition } from '@headlessui/react'
import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { Loader } from '@sushiswap/ui'
import { FC } from 'react'

import { Pair } from '../../.graphclient'
import { AddSectionLegacy, AddSectionTrident } from '.'

export interface AddSectionProps {
  pair: Pair | undefined
  chainId: ChainId
  loadingToken0: boolean
  loadingToken1: boolean
  token0: Type | undefined
  token1: Type | undefined
  setToken0(token: Type): void
  setToken1(token: Type): void
}

export const AddSection: FC<AddSectionProps> = ({ pair, ...rest }) => {
  if (!pair)
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Loader width="24px" />
      </div>
    )

  return (
    <Transition
      appear
      show={true}
      enter="transition duration-300 origin-center ease-out"
      enterFrom="transform scale-90 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform opacity-100"
      leaveTo="transform opacity-0"
    >
      {pair.source === 'TRIDENT' ? <AddSectionTrident {...rest} /> : <AddSectionLegacy {...rest} />}
    </Transition>
  )
}
