import React from 'react'

import { SwapProvider } from '../ui/TradeProvider'
import { Widget } from '../ui/widget/Widget'

export default function Page() {
  return (
    <SwapProvider>
      <div className="space-y-8 p-4">
        <Widget />
      </div>
    </SwapProvider>
  )
}
