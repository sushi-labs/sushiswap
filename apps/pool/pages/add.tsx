import { Transition } from '@headlessui/react'
import { ExternalLinkIcon } from '@heroicons/react/solid'
import { ChainId, chainShortName } from '@sushiswap/chain'
import { Currency, Native } from '@sushiswap/currency'
import { computePairAddress, FACTORY_ADDRESS } from '@sushiswap/exchange'
import { Container, Link, Typography } from '@sushiswap/ui'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { useNetwork } from 'wagmi'

import { Layout } from '../components'
import { AddSectionStepper } from '../components/AddSection'
import { AddSectionMyPosition } from '../components/AddSection'
import { AddSection } from '../components/AddSection/AddSection'
import { useTokens } from '../lib/state/token-lists'
import { PairWithAlias } from '../types'

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      ...(query.token0 && { token0: query.token0 }),
      ...(query.token1 && { token1: query.token1 }),
      ...(query.chainId && { chainId: query.chainId }),
    },
  }
}

const AddPage = ({
  token0: _token0,
  token1: _token1,
  chainId: _chainId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { chain } = useNetwork()
  const chainId = Number(_chainId ?? chain?.id ?? ChainId.ETHEREUM)
  const tokens = useTokens(chainId)
  const router = useRouter()
  const [step, setStep] = useState(1)
  const isFarm = true

  const [token0, setToken0] = useState<Currency | undefined>(
    _token0 === Native.onChain(chainId).symbol
      ? Native.onChain(chainId)
      : _token0 in tokens
      ? tokens[_token0]
      : undefined
  )

  // Check if Sushi address to avoid token flash on init since useTokens isn't available on server
  const [token1, setToken1] = useState<Currency | undefined>(
    _token1 === Native.onChain(chainId).symbol
      ? Native.onChain(chainId)
      : _token1 in tokens
      ? tokens[_token1]
      : undefined
  )

  const id =
    token0 && token1 && chainId
      ? `${chainShortName[chainId]}:${computePairAddress({
          factoryAddress: FACTORY_ADDRESS[token0.chainId],
          tokenA: token0.wrapped,
          tokenB: token1.wrapped,
        }).toLowerCase()}`
      : undefined

  const { data: pairData } = useSWR<{ pair: PairWithAlias }>(id ? `/pool/api/pool/${id}` : null, (url) =>
    fetch(url).then((response) => response.json())
  )

  useEffect(() => {
    if (
      token0 &&
      token1 &&
      chainId === Number(router.query.chainId) &&
      (token0.symbol === router.query.token0 || token0.wrapped.address === router.query.token0) &&
      (token1.symbol === router.query.token1 || token1.wrapped.address === router.query.token1)
    ) {
      return
    }

    if (token0 && token1) {
      void router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            chainId,
            token0: token0 && token0.isToken ? token0.address : token0.symbol,
            token1: token1 && token1.isToken ? token1.address : token1.symbol,
          },
        },
        undefined,
        { shallow: true }
      )
    }
  }, [router, chainId, token0, token1])

  useEffect(() => {
    setToken0(
      _token0 === Native.onChain(chainId).symbol
        ? Native.onChain(chainId)
        : _token0 in tokens
        ? tokens[_token0]
        : undefined
    )
  }, [_token0, chainId, tokens])
  useEffect(() => {
    setToken1(
      _token1 === Native.onChain(chainId).symbol
        ? Native.onChain(chainId)
        : _token1 in tokens
        ? tokens[_token1]
        : undefined
    )
  }, [_token1, chainId, tokens])

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-[264px_396px_264px] gap-10">
        <div />
        <div className="flex flex-col gap-3 pb-40">
          <AddSection
            pair={pairData?.pair}
            chainId={chainId}
            setToken0={setToken0}
            setToken1={setToken1}
            token1={token1}
            token0={token0}
            loadingToken1={_token1 && !token1}
            loadingToken0={_token0 && !token0}
          />
          {pairData?.pair && (
            <Container className="flex justify-center">
              <Link.External
                href="https://docs.sushi.com/docs/Products/Sushiswap/Liquidity%20Pools"
                className="flex justify-center px-6 py-4 decoration-slate-500 hover:bg-opacity-[0.06] cursor-pointer rounded-2xl"
              >
                <Typography variant="xs" weight={500} className="flex items-center gap-1 text-slate-500">
                  Learn more about liquidity and yield farming
                  <ExternalLinkIcon width={16} height={16} className="text-slate-500" />
                </Typography>
              </Link.External>
            </Container>
          )}
        </div>
        <div>
          {pairData?.pair && isFarm && (
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
              <div className="flex flex-col bg-white bg-opacity-[0.04] rounded-2xl">
                <AddSectionStepper onClick={setStep} step={step} pair={pairData.pair} />
                <div className="px-5">
                  <hr className="h-px border-t border-slate-200/5" />
                </div>
                <AddSectionMyPosition pair={pairData.pair} />
              </div>
            </Transition>
          )}
        </div>
      </div>
      <div className="z-[-1] bg-gradient-radial from-blue-500/10 via-slate-900 to-slate-900 fixed inset-0 bg-scroll bg-clip-border transform pointer-events-none" />
    </Layout>
  )
}

export default AddPage
