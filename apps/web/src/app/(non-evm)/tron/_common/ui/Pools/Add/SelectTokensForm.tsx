'use client'
import { FormSection } from '@sushiswap/ui'
import { useEffect } from 'react'
import { useIsContract } from '~tron/_common/lib/hooks/useIsContract'
import { usePairContract } from '~tron/_common/lib/hooks/usePairContract'
import { TokenListSelect } from '~tron/_common/ui/General/TokenListSelect'
import {
  usePoolDispatch,
  usePoolState,
} from '~tron/explore/pools/pool-provider'

export const SelectTokensForm = () => {
  const { token0, token1 } = usePoolState()
  const { setToken0, setToken1, setPairAddress } = usePoolDispatch()
  const { data: _pairAddress } = usePairContract({
    token0Address: token0?.address,
    token1Address: token1?.address,
  })
  const { data: isContract } = useIsContract({ address: _pairAddress })

  useEffect(() => {
    if (isContract && _pairAddress) {
      setPairAddress(_pairAddress)
    } else {
      setPairAddress(undefined)
    }
  }, [isContract, _pairAddress, setPairAddress])

  return (
    <FormSection
      title="Tokens"
      description="Which token pair would you like to add liquidity to."
    >
      <div className="flex gap-3">
        <TokenListSelect
          className="!text-sm !px-3 !rounded-xl"
          token={token0}
          setToken={setToken0}
        />
        <TokenListSelect
          className="!text-sm !px-3 !rounded-xl"
          token={token1}
          setToken={setToken1}
        />
      </div>
    </FormSection>
  )
}
