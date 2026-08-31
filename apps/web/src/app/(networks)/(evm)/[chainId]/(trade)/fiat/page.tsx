import { Container } from '@sushiswap/ui'
import { Suspense } from 'react'
import { DerivedstateFiatBuyProvider } from './_ui/derivedstate-fiat-buy-provider'
import { FiatBuyWidget } from './_ui/fiat-buy-widget'
import { FiatBuyWidgetFrame } from './_ui/fiat-buy-widget-frame'
import { FiatBuyWidgetSkeleton } from './_ui/fiat-buy-widget-skeleton'

export default function FiatBuyPage() {
  return (
    <Container maxWidth="lg">
      <FiatBuyWidgetFrame>
        <Suspense fallback={<FiatBuyWidgetSkeleton />}>
          <DerivedstateFiatBuyProvider>
            <FiatBuyWidget />
          </DerivedstateFiatBuyProvider>
        </Suspense>
      </FiatBuyWidgetFrame>
    </Container>
  )
}
