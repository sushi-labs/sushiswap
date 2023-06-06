import Container from '@sushiswap/ui/future/components/Container'
import { TradeStats } from '../../ui/swap/trade/TradeStats'
import { Widget } from '../../ui/swap/widget/Widget'
import { Drawer } from '@sushiswap/ui/future/components/drawer'
import { TokenNotFoundDialog } from '../../ui/swap/TokenNotFoundDialog'
import { TradeReviewDialog } from '../../ui/swap/trade/TradeReviewDialog'
import React, { FC } from 'react'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { SwapProvider } from '../../ui/swap/trade/TradeProvider'
import { SplashController } from '../../ui/swap/SplashController'
import { TokenProvider } from '../../ui/swap/token/TokenProvider'
import { Header } from '../../ui/swap/Header'
import { Onramper } from '@sushiswap/wagmi/future/components'
import { ThemeProvider } from '@sushiswap/ui'

export const Page: FC = () => {
  return (
    <ThemeProvider>
      <TokenProvider>
        <SplashController>
          <SwapProvider>
            <Onramper.Provider>
              <Header />
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
            </Onramper.Provider>
          </SwapProvider>
        </SplashController>
      </TokenProvider>
    </ThemeProvider>
  )
}

export default Page
