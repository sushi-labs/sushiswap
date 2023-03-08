import { ChainId } from '@sushiswap/chain'
import Container from '@sushiswap/ui/future/components/Container'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import React, { FC } from 'react'

import { TradeStats } from '../../../ui/trade/TradeStats'
import { Widget } from '../../../ui/widget/Widget'
import { Drawer } from '@sushiswap/ui/future/components/drawer'
import { NetworkCheck } from '../../../ui/NetworkCheck'
import { TokenNotFoundDialog } from '../../../ui/TokenNotFoundDialog'
import { TradeReviewDialog } from '../../../ui/trade/TradeReviewDialog'

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: {
      initialState: {
        fromCurrency: params?.fromCurrency ?? `${ChainId.ETHEREUM}:NATIVE`,
        toCurrency: params?.toCurrency ?? `${ChainId.ETHEREUM}:SUSHI`,
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

export const Page: FC = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Container maxWidth={520} className="p-4 mx-auto mt-16 mb-[86px] flex flex-col gap-4">
        <Drawer.Root>
          <Widget />
          <TradeStats />
          <TradeReviewDialog />
          <TokenNotFoundDialog />
        </Drawer.Root>

        {/*spacer for fixed positioned swap button */}
        <div className="h-[68px] w-full" />
      </Container>
    </>
  )
}

export default Page
