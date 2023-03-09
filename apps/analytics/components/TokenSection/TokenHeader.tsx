import { getAddress } from '@ethersproject/address'
import { formatUSD } from '@sushiswap/format'
import { Bundle, Token as GraphToken } from '@sushiswap/graph-client'
import { Button, Chip, Currency, Typography } from '@sushiswap/ui'
import { useRouter } from 'next/router'
import { FC } from 'react'
import useSWR from 'swr'

import { useTokenFromToken } from '../../lib/hooks'

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
          <Typography variant="lg" className="text-slate-200" weight={500}>
            {_token.name}
          </Typography>
          <Chip label={_token.symbol} />
        </div>
        <Typography variant="h3" className="text-slate-200" weight={600}>
          {price.includes('NaN') ? '$0.00' : price}
        </Typography>
      </div>
      <Button
        onClick={() =>
          router.push(
            `https://www.sushi.com/swap?chainId=${token.chainId}&token0=${getAddress(token.id.split(':')[1])}`
          )
        }
        size="md"
        fullWidth
      >
        Trade
      </Button>
    </div>
  )
}
