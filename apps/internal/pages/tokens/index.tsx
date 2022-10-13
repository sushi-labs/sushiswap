import { SearchIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { useDebounce } from '@sushiswap/hooks'
import { classNames, Network } from '@sushiswap/ui'
import { DEFAULT_INPUT_UNSTYLED } from '@sushiswap/ui/input'
import { Layout } from 'components'
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
    <Layout>
      <div className="flex flex-col gap-10 md:gap-16">
        <section className="flex flex-col gap-6">
          <div className="flex justify-between gap-3">
            <div
              className={
                'flex flex-grow sm:flex-grow-0 transform-all items-center gap-3 pr-4 bg-slate-800 rounded-2xl h-12'
              }
            >
              <div
                className={
                  'w-full sm:w-[240px] flex-grow pr-4 transform-all relative flex gap-2 items-center px-4 py-2.5 rounded-2xl'
                }
              >
                <div className="min-w-[24px] w-6 h-6 min-h-[24px] flex flex-grow items-center justify-center">
                  <SearchIcon className="text-slate-500" strokeWidth={2} width={20} height={20} />
                </div>
                <input
                  placeholder="Search a token"
                  className={classNames(DEFAULT_INPUT_UNSTYLED, 'flex flex-grow !text-base placeholder:text-sm')}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
          <Network.Selector
            networks={TOKENS_SUPPORTED_CHAIN_IDS}
            selectedNetworks={chainIds}
            onChange={(selectedNetworks) => setChainIds(selectedNetworks)}
          />

          <TokenTable tokens={tokens || []} />
        </section>
      </div>
    </Layout>
  )
}

export default TokensPage
