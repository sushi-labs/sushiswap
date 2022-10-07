import { ChainId } from '@sushiswap/chain'
import { useDebounce } from '@sushiswap/hooks'
import { Network } from '@sushiswap/ui'
import { TokenTable } from 'components/tokens/TokenTable'
import { TOKENS_SUPPORTED_CHAIN_IDS } from 'config'
import { getTokens, Token } from 'lib'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FC, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const tokens = await getTokens({ chainIds: TOKENS_SUPPORTED_CHAIN_IDS })

  return {
    props: {
      fallback: {
        [`tokens?chainIds${TOKENS_SUPPORTED_CHAIN_IDS}`]: tokens,
      },
    },
  }
}

const TokensPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_TokensPage />
    </SWRConfig>
  )
}

const _TokensPage: FC = () => {
  const [filter, setFilter] = useState<string>('')
  const [chainIds, setChainIds] = useState<ChainId[]>(TOKENS_SUPPORTED_CHAIN_IDS)
  const debouncedFilter = useDebounce(filter, 400)

  const { data: tokens } = useSWR<Token[]>(
    `tokens?chainIds${chainIds}${debouncedFilter ? `?filter=${debouncedFilter}` : ''}`,
    () => getTokens({ chainIds: chainIds, filter: debouncedFilter })
  )

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="space-y-4 max-w-7xl">
        <div className="flex items-center space-x-2">
          <input
            className="p-3 rounded-xl bg-slate-800"
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Symbol"
          />
          <Network.Selector
            networks={TOKENS_SUPPORTED_CHAIN_IDS}
            selectedNetworks={chainIds}
            onChange={(selectedNetworks) => setChainIds(selectedNetworks)}
          />
        </div>

        <TokenTable tokens={tokens || []} />
      </div>
    </div>
  )
}

export default TokensPage
