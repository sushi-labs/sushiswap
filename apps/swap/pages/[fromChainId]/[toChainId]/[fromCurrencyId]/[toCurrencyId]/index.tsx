import { ChainId } from '@sushiswap/chain'
import Container from '@sushiswap/ui13/components/Container'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import React, { FC } from 'react'

import { TradeReviewDialogSameChain } from '../../../../../ui/trade/TradeReviewDialogSameChain'
import { TradeStats } from '../../../../../ui/trade/TradeStats'
import { SwapButton } from '../../../../../ui/widget/SwapButton'
import { Widget } from '../../../../../ui/widget/Widget'
import { Drawer } from '@sushiswap/ui13/components/drawer'
import { NetworkCheck } from '../../../../../ui/NetworkCheck'
import { TokenNotFoundDialog } from '../../../../../ui/TokenNotFoundDialog'

export const getStaticProps: GetStaticProps = async ({ params }) => {
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

  // for now, we'll just use blocking mode so that params are available immediately
  return {
    paths: [],
    fallback: 'blocking',
  }
}

const Page: FC = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Container maxWidth={520} className="space-y-8 p-4 mx-auto mt-16 mb-[86px] flex flex-col gap-4">
      <Drawer.Root>
        <NetworkCheck />
        <Widget />
        <TradeStats />
        <TradeReviewDialogSameChain />
        <TokenNotFoundDialog />
      </Drawer.Root>

      {/*spacer for fixed positioned swap button */}
      <div className="h-[68px] w-full" />
    </Container>
  )
}

export default Page
