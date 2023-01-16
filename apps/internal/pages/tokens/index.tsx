import { SearchIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { useDebounce } from '@sushiswap/hooks'
import { classNames, DEFAULT_INPUT_UNSTYLED, Network } from '@sushiswap/ui'
import { Layout, TokenTable } from 'components'
import { TOKENS_SUPPORTED_CHAIN_IDS } from 'config'
import stringify from 'fast-json-stable-stringify'
import { getTokens, Token } from 'lib'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { FC, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'

export const getStaticProps: GetStaticProps = async (context) => {
  const tokens = await getTokens({
    chainIds: TOKENS_SUPPORTED_CHAIN_IDS,
    filter: '',
  })
  return {
    props: {
      fallback: {
        [`/internal/api/tokens?chainIds=${TOKENS_SUPPORTED_CHAIN_IDS}&filter=`]: tokens,
      },
      revalidate: 60,
    },
  }
}

const fetcher = ({
  url,
  args,
}: {
  url: string
  args: {
    chainIds: ChainId[]
    filter: string
  }
}) => {
  const _url = new URL(url, window.location.origin)

  if (args.chainIds) {
    _url.searchParams.set('chainIds', stringify(args.chainIds))
  }

  if (args.filter) {
    _url.searchParams.set('filter', stringify(args.filter))
  }

  return fetch(_url.href)
    .then((res) => res.json())
    .catch((e) => console.log(stringify(e)))
}

const TokensPage: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ fallback }) => {
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
    {
      url: '/internal/api/tokens',
      args: { filter: debouncedFilter, chainIds },
    },
    fetcher
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
