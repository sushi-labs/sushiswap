import { Container } from '@sushiswap/ui'
import { FiatBuyWidgetFrame } from './_ui/fiat-buy-widget-frame'
import { FiatBuyWidgetSkeleton } from './_ui/fiat-buy-widget-skeleton'

export default function FiatBuyLoading() {
  return (
    <Container maxWidth="lg">
      <FiatBuyWidgetFrame>
        <FiatBuyWidgetSkeleton />
      </FiatBuyWidgetFrame>
    </Container>
  )
}
