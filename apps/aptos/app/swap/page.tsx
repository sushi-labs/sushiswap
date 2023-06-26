'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Drawer } from '@sushiswap/ui'
import Container from '@sushiswap/ui/future/components/Container'
import SwapTrade from 'components/SwapTrade'
import TokenListDialog from 'components/TokenListDialog'
import TradeInput from 'components/TradeInput'
import React, { Fragment, useState } from 'react'
import { SwitchAppType } from 'widget/SwitchAppType'
import { ThunderCoreBanner } from 'widget/ThunderCoreBanner'
import { WidgetTitleV2 } from 'widget/WidgetTitleV2'

export default function SwapPage() {
  const token0 = 'APTOS';
  const token1 = 'SUSHI'
  const [open, setOpen] = useState<boolean>(false);
  const [inverse, setInverse] = useState<boolean>(false);

  // return <WidgetTitleV2 />
  return (
    <>
      <Container maxWidth={520} className="p-4 mx-auto mt-16 mb-[86px] flex flex-col gap-4">
        <Drawer.Root>
          <WidgetTitleV2 />
          <SwitchAppType />
          {inverse == true ?
            <>
              <TradeInput setOpen={setOpen} tokenName={token0} imgURL={'https://aptosfoundation.org/brandbook/logomark/PNG/Aptos_mark_BLK.png'} />
              <SwapTrade inverse={inverse} setInverse={setInverse} />
              <TradeInput setOpen={setOpen} tokenName={token1} imgURL={'https://cdn.sushi.com/image/upload/f_auto,c_limit,w_64,q_auto/tokens/1/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2.jpg'} />
            </> :
            <>
              <TradeInput setOpen={setOpen} tokenName={token1} imgURL={'https://cdn.sushi.com/image/upload/f_auto,c_limit,w_64,q_auto/tokens/1/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2.jpg'} />
              <SwapTrade inverse={inverse} setInverse={setInverse} />
              <TradeInput setOpen={setOpen} tokenName={token0} imgURL={'https://aptosfoundation.org/brandbook/logomark/PNG/Aptos_mark_BLK.png'} />
            </>
          }
          <ThunderCoreBanner />
        </Drawer.Root>
        {/*spacer for fixed positioned swap button */}
        <div className="h-[68px] w-full" />
      </Container>
      <TokenListDialog open={open} setOpen={setOpen} />
    </>
  )
}
