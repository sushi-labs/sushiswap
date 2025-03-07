'use client'

import { Container, classNames } from '@sushiswap/ui'
import { useSidebar } from 'src/ui/sidebar'
import { SankeyPreview } from 'src/ui/swap/route-diagram/Modal/SankeyModal/SankeyPreview'
import { useSimpleSwapTradeQuote } from 'src/ui/swap/simple/derivedstate-simple-swap-provider'
import { SimpleSwapWidget } from 'src/ui/swap/simple/simple-swap-widget'

export default function SwapSimplePage() {
  const { isLoading, isFetched } = useSimpleSwapTradeQuote()
  const { isOpen: isSidebarOpen } = useSidebar()

  const showViz = isLoading || isFetched

  return (
    <div
      className={classNames(
        'flex justify-center flex-wrap gap-y-4 h-full',
        isSidebarOpen && showViz && 'lg:ml-56',
      )}
    >
      <Container maxWidth="lg" className="px-4 !mx-[unset]">
        <SimpleSwapWidget />
      </Container>
      {showViz ? (
        <Container maxWidth="lg" className="px-4 !mx-[unset] flex items-center">
          <SankeyPreview />
        </Container>
      ) : null}
    </div>
  )
}
