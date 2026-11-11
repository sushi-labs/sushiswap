'use client'

import {
  type SushiSwapV4ChainId,
  SushiSwapV4ChainIds,
} from '@sushiswap/graph-client/data-api'
import { Button } from '@sushiswap/ui'
import { useRouter } from 'next/navigation'
import { type ReactElement, use, useState } from 'react'
import { SelectTokensWidget } from 'src/lib/components/select-tokens-widget'
import { isV4NativeCurrencyEnabled } from 'src/lib/pool/v4'
import { type EvmCurrency, getEvmChainById } from 'sushi/evm'
import { SelectNetworkWidget } from '../../_ui/select-network-widget'
import { V4PoolsList } from './_ui/v4-pools-list'

export default function Page(props: {
  params: Promise<{ chainId: string }>
}): ReactElement {
  const params = use(props.params)
  // The V4 layout only renders for indexed V4 chains
  const chainId = +params.chainId as SushiSwapV4ChainId

  return <SelectV4Pool key={chainId} chainId={chainId} />
}

function SelectV4Pool({
  chainId,
}: {
  chainId: SushiSwapV4ChainId
}): ReactElement {
  const router = useRouter()

  const [currencyA, setCurrencyA] = useState<EvmCurrency>()
  const [currencyB, setCurrencyB] = useState<EvmCurrency>()

  return (
    <>
      <SelectNetworkWidget
        selectedNetwork={chainId}
        onSelect={(chainId) =>
          router.push(`/${getEvmChainById(chainId).key}/pool/v4/add`)
        }
        networks={SushiSwapV4ChainIds}
      />
      <SelectTokensWidget
        chainId={chainId}
        title="Filter by tokens"
        token0={currencyA}
        token1={currencyB}
        setToken0={setCurrencyA}
        setToken1={setCurrencyB}
        includeNative={isV4NativeCurrencyEnabled(chainId)}
      >
        {currencyA || currencyB ? (
          <Button
            variant="link"
            size="sm"
            className="self-start"
            onClick={() => {
              setCurrencyA(undefined)
              setCurrencyB(undefined)
            }}
          >
            Clear filter
          </Button>
        ) : null}
      </SelectTokensWidget>
      <V4PoolsList chainId={chainId} currencies={[currencyA, currencyB]} />
    </>
  )
}
