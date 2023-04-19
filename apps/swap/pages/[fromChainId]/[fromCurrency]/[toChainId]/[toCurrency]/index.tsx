import Container from '@sushiswap/ui/future/components/Container'
import { TradeStats } from '../../../../../ui/trade/TradeStats'
import { Widget } from '../../../../../ui/widget/Widget'
import { Drawer } from '@sushiswap/ui/future/components/drawer'
import { TokenNotFoundDialog } from '../../../../../ui/TokenNotFoundDialog'
import { TradeReviewDialog } from '../../../../../ui/trade/TradeReviewDialog'
import { FC } from 'react'

export const Page: FC = () => {
  return (
    <>
      <ExploitApprovalAlert />
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
