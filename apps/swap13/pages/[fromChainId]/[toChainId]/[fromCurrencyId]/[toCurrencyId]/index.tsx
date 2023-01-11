import { ChainId } from '@sushiswap/chain'
import Container from '@sushiswap/ui13/components/Container'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import React, { FC } from 'react'

import { SwapProvider } from '../../../../../ui/trade/TradeProvider'
import { TradeReviewDialog } from '../../../../../ui/trade/TradeReviewDialog'
import { TradeStats } from '../../../../../ui/trade/TradeStats'
import { SwapButton } from '../../../../../ui/widget/SwapButton'
import { Widget } from '../../../../../ui/widget/Widget'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // const { fromChainId, toChainId, fromCurrencyId, toCurrencyId } = params
  return {
    props: {
      initialState: {
        fromChainId: params?.fromChainId ?? ChainId.ETHEREUM,
        toChainId: params?.toChainId ?? ChainId.ETHEREUM,
        fromCurrencyId: params?.fromCurrencyId ?? 'NATIVE',
        toCurrencyId: params?.toCurrencyId ?? 'SUSHI',
      },
    },
  }
}

export async function getStaticPaths() {
  // We can do some pretty cool optimizations here by generating the combinations
  // of potential swap parameters

  // for now we'll just use blocking mode so that params are available immediately
  return {
    paths: [],
    fallback: 'blocking',
  }
}

const Page: FC = ({ initialState }: InferGetStaticPropsType<typeof getStaticProps>) => {
  console.log({ initialState })
  return (
    <Container maxWidth={520} className="space-y-8 p-4 mx-auto mt-16 mb-[86px] flex flex-col gap-4">
      <SwapProvider>
        <Widget />
        <TradeStats />
        <TradeReviewDialog />
        <SwapButton />
      </SwapProvider>

      {/*spacer for fixed positioned swap button */}
      <div className="h-[68px] w-full" />
    </Container>
  )
}

export default Page
