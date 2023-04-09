import Container from '@sushiswap/ui/future/components/Container'
import { TradeStats } from '../ui/trade/TradeStats'
import { Widget } from '../ui/widget/Widget'
import { Drawer } from '@sushiswap/ui/future/components/drawer'
import { TokenNotFoundDialog } from '../ui/TokenNotFoundDialog'
import { TradeReviewDialog } from '../ui/trade/TradeReviewDialog'
import React, { FC } from 'react'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { ExploitApprovalAlert } from '../ui/ExploitApprovalAlert'

export const Page: FC = () => {
  return (
    <>
      <ExploitApprovalAlert />
      <Container maxWidth={520} className="p-4 mx-auto mt-16 mb-[86px] flex flex-col gap-4">
        <Drawer.Root>
          <Checker.Root>
            <Widget />
            <TradeStats />
            <TradeReviewDialog />
            <TokenNotFoundDialog />
          </Checker.Root>
        </Drawer.Root>

        {/*spacer for fixed positioned swap button */}
        <div className="h-[68px] w-full" />
      </Container>
    </>
  )
}

export default Page
