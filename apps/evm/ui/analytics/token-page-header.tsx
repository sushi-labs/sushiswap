'use client'

import { formatUSD } from '@sushiswap/format'
import { Bundle, Token as GraphToken } from '@sushiswap/graph-client'
import { Button } from '@sushiswap/ui/components/button'
import { Chip } from '@sushiswap/ui/components/chip'
import { Currency } from '@sushiswap/ui/components/currency'
import { useRouter } from 'next/router'
import { FC } from 'react'
import useSWR from 'swr'
import { getAddress } from 'viem'

import { useTokenFromToken } from '../../lib/hooks/useTokenFromToken'

interface TokenHeader {
  token: GraphToken
}
export const TokenHeader: FC<TokenHeader> = ({ token }) => {
  const router = useRouter()
  const _token = useTokenFromToken(token)
  const { data: bundles } = useSWR<Bundle[]>('/analytics/api/bundles', (url) =>
    fetch(url).then((response) => response.json())
  )

  const price = formatUSD(token.price.derivedNative * bundles?.[token.chainId]?.nativePrice)

  return (
    <div className="grid grid-cols-[auto_180px]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div>
            <Currency.Icon currency={_token} width={24} height={24} />
          </div>
          <span className="text-lg font-medium text-slate-200">{_token.name}</span>
          <Chip variant="ghost">{_token.symbol}</Chip>
        </div>
        <span className="text-2xl font-semibold text-slate-200">{price.includes('NaN') ? '$0.00' : price}</span>
      </div>
      <Button
        onClick={() =>
          router.push(
            `https://www.sushi.com/swap?chainId=${token.chainId}&token0=${getAddress(token.id.split(':')[1])}`
          )
        }
        fullWidth
      >
        Trade
      </Button>
    </div>
  )
}
